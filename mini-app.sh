#!/usr/bin/env bash

windowsOS=false
if [ "$OSTYPE" = "msys" ] ; then
  windowsOS=true;
elif [[ "$OSTYPE" == "cygwin" ]]; then
  windowsOS=true;
elif [[ "$OSTYPE" == "win32" ]]; then
  windowsOS=true;
fi

function has_opt() {
  OPT_NAME=$1
  shift
  for i in "$@"; do
    if [[ $i == $OPT_NAME ]] ; then
      return 0  # true in bash
    fi
  done
  return 1  # false in bash
}

function get_opt() {
  OPT_NAME=$1
  DEFAULT_VALUE=$2
  shift

  for i in "$@"; do
    index=$(($index+1))
    if [[ $i == $OPT_NAME* ]] ; then
      value="${i#*=}"
      echo "$value"
      return
    fi
  done
  echo $DEFAULT_VALUE
}

function install() {
  if has_opt "-clean" $@; then
    rm -rf node_modules dist pnpm-lock.yaml
  fi
  pnpm install
}

function build() {
  if has_opt "-clean" $@; then
    ./mini-app.sh install -clean
  fi
  pnpm run build
}

function login() {
  pnpm run login
}

function deploy() {
  pnpm run deploy
}

function run() {
  pnpm run server
}

function show_help() {
  echo """
./mini-app.sh [COMMAND] [OPTION]

Commands:

  Login to Zalo:
    ./mini-app.sh login

  Install dependencies:
    ./mini-app.sh install [-clean]
      -clean: Remove node_modules, dist, pnpm-lock.yaml

  Build application: 
    ./mini-app.sh build [-clean]
      -clean: Remove node_modules, dist, pnpm-lock.yaml. Reinstall dependencies.

  Run application:
    ./mini-app.sh run

  Deploy application (Develop/Test):
    ./mini-app.sh deploy

  """
}

COMMAND=$1;
if [ -n "$COMMAND" ]; then
  shift
else
  echo "No command provided. Showing help..."
  show_help
  exit 1
fi

if [ "$COMMAND" = "build" ] ; then
  build $@
elif [ "$COMMAND" = "install" ] ; then
  install $@
elif [ "$COMMAND" = "login" ] ; then
  login
elif [ "$COMMAND" = "run" ] ; then
  run
elif [ "$COMMAND" = "deploy" ] ; then
  deploy
else
  show_help
fi