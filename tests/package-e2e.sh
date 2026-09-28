#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TEST_DIR=$(mktemp -d)
PACK_DIR="$TEST_DIR/packages"
FIXTURE_DIR="$ROOT_DIR/tests/fixtures/vite-react"

trap 'rm -rf "$TEST_DIR"' EXIT

mkdir -p "$PACK_DIR"

cd "$ROOT_DIR"
pnpm build
pnpm pack --pack-destination "$PACK_DIR"

PACKAGE_PATH=$(find "$PACK_DIR" -maxdepth 1 -name '*.tgz' -print -quit)
if [[ -z "$PACKAGE_PATH" ]]; then
  echo "Expected package tarball was not created." >&2
  exit 1
fi

for react_version in 18 19; do
  APP_DIR="$TEST_DIR/react-$react_version"
  cp -R "$FIXTURE_DIR" "$APP_DIR"

  cd "$APP_DIR"
  pnpm install --no-frozen-lockfile
  pnpm add --save-exact \
    "react@$react_version" \
    "react-dom@$react_version" \
    "@types/react@$react_version" \
    "@types/react-dom@$react_version" \
    "$PACKAGE_PATH"

  node --input-type=module <<'EOF'
import { createWire, getWireId } from '@forminator/react-wire';

const wire = createWire(1);
wire.setValue(2);

if (wire.getValue() !== 2 || typeof getWireId(wire) !== 'string') {
  throw new Error('The installed package returned unexpected values.');
}
EOF

  pnpm build
done
