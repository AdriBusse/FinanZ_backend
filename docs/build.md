# TODO

somehow the build process didnt worked anymore. i added in Dockerfile the /src dir when execute the script.
Also i added in the orm config when in prod the src dir. 

Ormconfig.js was also not copied into the container

Solution: When build into dist dont build into src. let all be at the root from dist