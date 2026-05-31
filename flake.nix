{
  description = "Node";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  outputs =
    { nixpkgs, ... }:
    {
      devShells.x86_64-linux =
        let
          pkgs = nixpkgs.legacyPackages.x86_64-linux;

          myShell = pkgs.mkShell {
            packages = with pkgs; [
              nodejs
              prettier
            ];
          };
        in
        {
          default = myShell;
        };
    };
}
