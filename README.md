# Chainskills App Demo


### WHEN USING TRUFFLE CONSOLE TO MANIPULATE CONTRACTS

ERROR : "Invalid number of arguments to Solidity function", etc.

EX: Make sure you attach a console inside the
directory instead of globally.

#### [Via GITHUB :](https://github.com/ethereum/web3.js/issues/1043)

Delete your build folder, then run the command.
```
npm run truffle migrate --reset --compile-all
```
I find it works best when running truffle locally to the folder rather than globally, due to the beta and different versions getting updated quickly recently.
if you prefer the global approach try

```
truffle migrate --reset --compile-all
```
---

## Usage of startnode.sh

The contents of startnode MUST be on one line when being run.

---

