# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
  ];
  # Sets environment variables in the workspace
  env = {
    NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyDCsMsJvLCIJ3rKXUpUoNpCHgDW6r-Cl0Y";
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "your_auth_domain";
    NEXT_PUBLIC_FIREBASE_PROJECT_ID = "your_project_id";
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "your_storage_bucket";
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "your_messaging_sender_id";
    NEXT_PUBLIC_FIREBASE_APP_ID = "your_app_id";
  };
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
  # a firebase.json file is written into the user's directory
  services.firebase.emulators = {
    detect = true;
    projectId = "demo-app";
    services = ["auth" "firestore"];
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
