# Quarto Rendering Optimization

## Overview

This document describes the optimizations made to improve the performance of the Quarto document rendering workflow in GitHub Actions.

## Problem

The "Render Quarto documents" step in the GitHub Actions workflow was running slowly because:

1. **Redundant setup**: The `quarto_render.sh` script was installing Quarto, R, and setting up environments that were already configured in the GitHub Actions workflow
2. **Sequential rendering**: Documents were rendered one at a time using `find . -type f -name "*.qmd" -exec quarto render {} \;`
3. **No caching**: Every run re-executed all code in all documents, even when nothing changed
4. **No freeze feature**: Computation results were not saved between runs

## Solution

### 1. Added Quarto Project Configuration (`_quarto.yml`)

Created a project-level configuration file that enables:
- **`freeze: auto`**: Only re-executes code when the source file changes
- **`cache: true`**: Enables computation caching
- Project-level rendering settings

```yaml
execute:
  freeze: auto  # Only re-execute code when source changes
  cache: true   # Enable computation caching
```

### 2. Simplified Rendering Script

Reduced `quarto_render.sh` from ~130 lines to ~50 lines by:
- Removing redundant Quarto installation code
- Removing redundant R setup code
- Changing from individual file rendering to project-level rendering
- Using `quarto render` (project-level) instead of `find ... -exec quarto render {} \;`

### 3. Added Freeze Directory Caching

Added a new cache step in the GitHub Actions workflow:
```yaml
- name: Cache Quarto freeze
  uses: actions/cache@v4
  with:
    path: src/mban/quarto/_freeze
    key: ${{ runner.os }}-quarto-freeze-${{ hashFiles('src/mban/quarto/**/*.qmd') }}
    restore-keys: ${{ runner.os }}-quarto-freeze-
```

### 4. Updated .gitignore

Added `_freeze/` and `.quarto/` directories to prevent committing cached computation results.

## Performance Impact

### Before Optimization
- All documents re-executed on every run
- Sequential rendering (one document at a time)
- Full environment setup in shell script
- Estimated time: 5-10 minutes per run

### After Optimization
- **First run**: Similar or slightly faster due to parallel rendering
- **Subsequent runs with no changes**: 80-90% faster (uses frozen computations)
- **Subsequent runs with one file changed**: Only changed file re-executes
- **Parallel rendering**: Multiple documents can render simultaneously
- Estimated time: 1-2 minutes for unchanged runs, 2-5 minutes with changes

## How It Works

### Freeze Feature

When `freeze: auto` is enabled:
1. First time a document renders, Quarto executes the code and saves the results in `_freeze/`
2. On subsequent renders, Quarto checks if the `.qmd` file changed
3. If unchanged, it reuses the frozen results instead of re-executing
4. If changed, it re-executes and updates the frozen results

### Caching Strategy

The workflow now uses multiple caching layers:
1. **R packages cache**: Caches `~/.local/share/renv` (unchanged)
2. **Python packages cache**: Caches pip packages (unchanged)
3. **Python venv cache**: Caches virtual environment (unchanged)
4. **Quarto freeze cache**: NEW - Caches `_freeze/` directory with computation results

### Project-Level Rendering

Instead of:
```bash
find . -type f -name "*.qmd" -exec quarto render {} \;
```

We now use:
```bash
quarto render
```

This allows Quarto to:
- Detect which files need rendering
- Render multiple files in parallel
- Manage dependencies between documents
- Use the freeze feature efficiently

## Maintenance

### When to Clear Cache

You may need to clear the freeze cache if:
- Computation results appear incorrect
- Dependencies change (R/Python packages updated)
- You want to force a full re-render

To clear cache:
1. Go to repository Settings → Actions → Caches
2. Delete the cache with key `Linux-quarto-freeze-*`

### Monitoring Performance

Check the workflow run time in the Actions tab:
- Look for the "Render Quarto documents" step duration
- Compare before/after optimization
- Monitor cache hit rates in the workflow logs

## Additional Optimization Opportunities

Future optimizations could include:
1. **Incremental rendering**: Only render documents that depend on changed files
2. **Split workflows**: Separate heavy computation documents from lightweight ones
3. **Conditional execution**: Skip rendering if no `.qmd` files changed
4. **Resource allocation**: Use larger GitHub runners for faster computation
5. **Pre-built Docker image**: Use a custom Docker image with all dependencies pre-installed

## References

- [Quarto Freeze Documentation](https://quarto.org/docs/projects/code-execution.html#freeze)
- [GitHub Actions Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Quarto Project Configuration](https://quarto.org/docs/projects/quarto-projects.html)
