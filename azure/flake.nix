{
  description = "Azure deployment shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  outputs =
    { nixpkgs, ... }:
    {
      devShells.x86_64-linux =
        let
          pkgs = import nixpkgs {
            system = "x86_64-linux";
            config.allowUnfree = true;
          };

          myShell = pkgs.mkShell {
            packages = with pkgs; [
              azure-cli
              terraform
              nodejs
              zip
            ];
          };
        in
        {
          default = myShell;
        };
    };
}
