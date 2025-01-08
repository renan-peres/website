import os
import sys
import json

def get_secrets():
    # Get all environment variables
    env_vars = dict(os.environ)
    
    # Filter variables that contain specific strings
    secrets = {
        key: value for key, value in env_vars.items()
        if any(substr in key for substr in ('KEY', 'API', 'SECRET', 'TOKEN'))
    }
    
    return secrets

# Usage
secrets = get_secrets()
sys.stdout.write(json.dumps(secrets, indent=2) + '\n')