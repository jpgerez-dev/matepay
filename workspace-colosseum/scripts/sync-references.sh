#!/bin/sh
# Copia los docs que usa cada skill a .devin/skills/<skill>/references/,
# así `npx skills add` las instala completas (fuera del repo no existe docs/).
# docs/ es la fuente: editá ahí y corré este script antes de commitear.
set -e
cd "$(dirname "$0")/.."
S=.devin/skills

sync() { # sync <skill> <archivo en docs/>...
  skill=$1; shift
  rm -rf "$S/$skill/references"
  mkdir -p "$S/$skill/references"
  for f in "$@"; do cp -R "docs/$f" "$S/$skill/references/"; done
}

sync solana-tuc-status  contexto-hackathon.md ejemplo
sync solana-tuc-empezar    contexto-hackathon.md skills-externas.md
sync solana-tuc-idea       contexto-hackathon.md referencias-ganadores.md
sync solana-tuc-validar    contexto-hackathon.md referencias-ganadores.md skills-externas.md
sync solana-tuc-mvp        contexto-hackathon.md
sync solana-tuc-planificar contexto-hackathon.md guia-devin-para-construir.md skills-externas.md
sync solana-tuc-pitch      contexto-hackathon.md referencias-ganadores.md skills-externas.md
cp AGENTS.md "$S/solana-tuc-planificar/references/AGENTS.template.md"
