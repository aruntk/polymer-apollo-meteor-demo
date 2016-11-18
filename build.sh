#!/bin/bash
# Build meteor polymer project.
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
echo "Installing bower components."
if bower install; then
  echo "Installed bower components."
else
  echo "${red}Bower installation failed!${reset}" 1>&2
  exit 1
fi
echo "Installing npm packages."
if meteor npm install; then
  echo "Installed npm packages.${reset}"
else
  echo "${red}NPM installation failed!${reset}" 1>&2
  exit 1
fi
echo "${green}build complete. run meteor.${reset}"
