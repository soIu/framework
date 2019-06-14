for module in $(find * -maxdepth 1 -mindepth 1 | grep modules.pyj | grep -v .pyj-cached); do echo "import $module" | sed "s/.pyj//g" | tr / .; done
