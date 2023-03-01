# discord_gdpr_parser
Parse and generate relevant data from your discord GDPR download

required:
- `nodejs`
- `node-typescript`

required npm packages (install with npm):
- `adm-zip`
- `minimist`

In order to run first you must compile the TS file into JS

```
$ tsc parser.ts --out parser_out.js
```

Then you can run the compiled javascript file with node as so

```
$ node parser.js {path_to_discord_data.zip}
```
