import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Web3 from "web3";
import { injected } from "../wallet/connectors";
import { useWeb3React } from "@web3-react/core";
import contractAbi from "../abi/testnetGenesisAbi.json";
import BUSDAbi from "../abi/BUSDAbi.json";

import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { isMobile } from "react-device-detect";
import TextField from "@material-ui/core/TextField";
import { ContactsOutlined } from "@material-ui/icons";
import banner from "../collage.png";
import videoSrc from "../PlatinumEliteNFT.mp4";
import bg from "../HEORE.jpg";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    borderRadius: 20,
    padding: 10,
    margin: "10px",
    color: "snow",
    border: "1px solid snow",
    // backgroundColor: "none", //"#F2DFD8"
    "&:disabled": {
      color: "#408ea6",
      backgroundColor: "#040b38",
    },
    "&:hover": {
      background: "linear-gradient(yellow, red)",
      color: "#1e2761",
    },
  },
  title: {
    flexGrow: 1,
  },
  img: {
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "90%",
    },
  },
  h3: {
    marginBottom: 10,
    fontWeight: "Bolder",
    color: "#408ec6",
    [theme.breakpoints.down("xs")]: {
      fontSize: 30,
    },
  },
  h4: {
    marginBottom: 5,
    fontWeight: "Bolder",
    color: "snow",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    },
  },
  subHeading: {
    marginBottom: 5,
    fontWeight: "Bolder",
    color: "snow",
    fontSize: 16,
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  subHeadingAnchor: {
    marginBottom: 5,
    fontWeight: "Bolder",
    color: "snow",
    fontSize: 16,
    textAlign: "center",
    textDecoration: "underline",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
    "&:hover": {
      color: "#4545f1",
    },
  },
  instruction: {
    padding: 5,
    color: "snow",
    fontSize: 15,
    [theme.breakpoints.down("xs")]: {
      fontSize: 13,
    },
  },
  mint: {
    marginBottom: 5,
    fontWeight: "Bolder",
    color: "snow",
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  body2: {
    marginBottom: 10,
    color: "#408ec6",
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
    },
  },
  subtitle1: {
    fontWeight: "bold",
    color: "#408ec6",
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
    },
  },
  inputCount: {
    width: 100,
    backgroundColor: "white",
    // borderRadius: 8,
    [theme.breakpoints.down("xs")]: {
      width: 50,
    },
  },
  decrementBtn: {
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderRadius: 0,
    // backgroundColor: "#1e2761",
    color: "snow",
    border: "1px solid snow",
    padding: 7,
    "&:disabled": {
      color: "white",
      backgroundColor: "grey",
    },
    "&:hover": {
      background: "linear-gradient(yellow, red)",
      color: "#1e2761",
    },
  },
  incrementBtn: {
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderRadius: 0,
    // backgroundColor: "#1e2761",
    color: "snow",
    border: "1px solid snow",
    padding: 7,
    "&:disabled": {
      color: "white",
      backgroundColor: "grey",
    },
    "&:hover": {
      background: "linear-gradient(yellow, red)",
      color: "#1e2761",
    },
  },
  imgContainer: {
    maxWidth: 700,
    display: "flex",
    justifyContent: "center",
    margin: 10,
    borderRadius: 30,
    boxShadow: "0 0 30px 0 rgba(189,191,255,0.37)",
  },
}));

function TopSection() {
  const classes = useStyles();
  const [count, setCount] = useState(1);
  const [allowed, setAllowed] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const wei = 1000000000000000000;
  const price = 0.25; // 0.07 -- for public sale 0.10

  const { active, account, activate } = useWeb3React();

  let web3 = new Web3(window?.web3?.currentProvider);
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_PROVIDER_URL)
    );
  }
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const ContractAddress = process.env.REACT_APP_GENESIS_CONTRACT_ADDRESS;
  const BUSDContractAddress = process.env.REACT_APP_BUSD_CONTRACT;
  const Contract = new web3.eth.Contract(contractAbi, ContractAddress);
  const BUSDContract = new web3.eth.Contract(BUSDAbi, BUSDContractAddress);

  useEffect(() => {
    console.log(active, "jdshfjgsdjgfsgdfgjh");
    if (active) checkAllowance();
    getBalance();
    getMintedToken();
  }, [active, account, count, allowed]);

  async function checkAllowance() {
    try {
      let result = await BUSDContract.methods
        .allowance(`${account}`, "0x887065c1C18A137d9cD93008e815a0c4B7eb1009")
        .call();
      console.log(result / wei);
      setAllowed(result / wei);
    } catch (err) {
      console.log(err);
      alert(JSON.stringify(err));
    }
  }

  async function approveBUSD() {
    try {
      if (!window?.web3?.currentProvider) {
        alert(`Metamask is not installed.
Try Different browser or Install Metamask.`);
        return;
      }
      await activate(injected);

      let id = await web3.eth.net.getId();

      if (id !== parseInt(chainId)) {
        alert("Please change your network to BSC Mainnet");
        return false;
      }

      const accounts = await web3.eth.getAccounts();

      let weiCount = count * 200 * wei;

      let balance = await BUSDContract.methods.balanceOf(accounts[0]).call();

      if (balance < weiCount) {
        alert("You do not have required BUSD!");
        return;
      }

      let result = await BUSDContract.methods
        .approve("0x887065c1C18A137d9cD93008e815a0c4B7eb1009", `${weiCount}`)
        .send({
          from: accounts[0],
          // value: web3.utils.toWei(`${count * price}`, "ether"),
        });
      console.log(result);
      setAllowed(weiCount / wei);
    } catch (err) {
      console.log(err);
      alert(JSON.stringify(err));
    }
  }

  async function getBalance() {
    try {
      if (active) {
        let balance = await Contract.methods.balanceOf(account, "1").call();
        setCurrentBalance(balance);
      }
    } catch (err) {
      console.log(err);
      alert(JSON.stringify(err));
    }
  }

  async function getMintedToken() {
    try {
      if (active) {
        let totalSupply = await Contract.methods.totalSupply().call();
        console.log(totalSupply, "djfghjdjh");
        setTotalSupply(totalSupply);
      }
    } catch (err) {
      console.log(err);
      alert(JSON.stringify(err));
    }
  }

  async function mint() {
    try {
      if (!window?.web3?.currentProvider) {
        alert(`Metamask is not installed.
Try Different browser or Install Metamask.`);
        return;
      }
      await activate(injected);

      let id = await web3.eth.net.getId();

      if (id !== parseInt(chainId)) {
        alert("Please change your network to BSC Mainnet");
        return false;
      }

      const accounts = await web3.eth.getAccounts();
      let result = await Contract.methods.mintByBusd(count).send({
        from: accounts[0],
        // value: web3.utils.toWei(`${count * price}`, "ether"),
      });
      checkAllowance();
      console.log(result);
      return "success";
    } catch (err) {
      alert(JSON.stringify(err.message));
      return "failed";
    }
  }

  async function connect() {
    try {
      if (!window?.web3?.currentProvider) {
        alert(`Metamask is not installed.
Try Different browser or Install Metamask.`);
        return;
      }
      let id = await web3.eth.net.getId();
      if (id !== parseInt(chainId)) {
        alert("Please change your network to BSC Mainnet");
        return false;
      }
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />

      <Grid
        container
        style={{
          width: "100%",
          justifyContent: "center",
          backgroundColor: "black",
          // backgroundImage: `url(${bg})`,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",
          // minHeight: "100vh",
          padding: "200px 0 50px",
        }}
      >
        <Grid
          item
          lg={5}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Typography
            component="div"
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 700,
              padding: 20,
            }}
          >
            <Typography variant="h3" className={classes.h4}>
              Whitelist Mint is Now Open!
            </Typography>
            <Typography variant="h6" className={classes.subHeading}>
              Mint your Platinum Elite NFT Loot Boxes before they are sold out.{" "}
              <br />
              Each NFT grants its owner an exclusive in-game item and 2500 CRT
              tokens Airdrop.
            </Typography>
            <a
              href="https://whitepaper.cryptorambo.io/tokenomics/platinum-elite-nft"
              target={"_blank"}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="h6" className={classes.subHeadingAnchor}>
                Click here to discover all the benefits of owning this NFT.
              </Typography>
            </a>
            {/* <Typography variant="h6" className={classes.mint}>
              200 BUSD / NFT
            </Typography> */}
            <Typography variant="h6" className={classes.instruction}>
              <Typography variant="h5" style={{ margin: "5px 0" }}>
                {" "}
                Instructions:{" "}
              </Typography>
              1. Connect your Metamask wallet. <br />
              2. Select the number of NFTs you want to mint. <br />
              3. Click Approve, then confirm permissions on Metamask.
              <br />
              &nbsp; (Wait for a few seconds until you see ''Mint Now'') <br />
              4. Click on 'Mint Now'. <br />
              5. Confirm the transaction on your Metamask. <br />
              6. Your NFT Balance should be updated and show your owned NFTs.
              <br /> &nbsp;(Give it 1-2 min and refresh page if necessary)
            </Typography>
            {/* <Typography variant="h3" className={classes.h3}>
              Cool Boys
            </Typography>
            <Typography variant="h6" className={classes.body2}>
              First & Only collection of 10,000 Metaverse compatible Cool Boys
              NFTs that lets you travel for free, gives you access to passive
              income and exclusive events such as yacht and mansion parties in
              the physical and digital world. Join our Discord for updates!
            </Typography>
            <Typography variant="subtitle1" className={classes.subtitle1}>
              Pre-Sale Mint: 25th February 9pm EST @ 0.07 ETH + Gas Fee
            </Typography>
            <Typography variant="subtitle1" className={classes.subtitle1}>
              Public Mint: 2nd March 2pm EST @ 0.10 ETH + Gas Fee
            </Typography> */}

            {/* mint counter */}
            <Typography variant="h5" className={classes.mint}>
              Total NFTs Minted: {totalSupply} / 2800
            </Typography>
            <Typography variant="h6" className={classes.mint}>
              Price for each NFT is $200 BUSD
            </Typography>
            <Typography variant="body1" style={{color: "white", textAlign: "center"}}>
              Connect Wallet to see # of NFTs minted.
            </Typography>
            {window.ethereum ? (
              <Button
                color="inherit"
                // variant="contained"
                className={classes.menuButton}
                style={{ marginTop: 20 }}
                onClick={connect}
              >
                {" "}
                {active ? "Connected" : "Connect Wallet"}
              </Button>
            ) : (
              <Button
                color="inherit"
                // variant="contained"
                className={classes.menuButton}
                style={{ marginTop: 20 }}
                href={"https://metamask.app.link/dapp/cryptorambo.io/mint/"}
              >
                {" "}
                {active ? "Connected" : "Connect Wallet"}
              </Button>
            )}

            <Typography component="div" style={{ display: "flex" }}>
              <Button
                color="inherit"
                variant="outlined"
                className={classes.decrementBtn}
                disabled={count < 2}
                onClick={() => setCount(count - 1)}
              >
                -
              </Button>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="nubmer"
                size="small"
                disabled={true}
                value={count}
                className={classes.inputCount}
              />
              <Button
                color="inherit"
                variant="outlined"
                className={classes.incrementBtn}
                disabled={count > 9}
                onClick={() => setCount(count + 1)}
              >
                +
              </Button>
            </Typography>
            <Typography component="div">
              {/* <Button
                href="https://discord.gg/nf89WZxKha"
                color="inherit"
                variant="outlined"
                className={classes.menuButton}
              >
                Join Discord
              </Button> */}

              {/* Mint button */}

              {isMobile ? (
                window.ethereum ? (
                  !active ? (
                    <Button
                      color="inherit"
                      // variant="contained"
                      className={classes.menuButton}
                      onClick={() => {
                        allowed < count * 200 ? approveBUSD() : mint();
                      }}
                    >
                      {allowed < count * 200 ? "Approve" : "Mint Now"}
                    </Button>
                  ) : (
                    <Button
                      color="inherit"
                      // variant="contained"
                      className={classes.menuButton}
                      disabled={!count}
                      onClick={() => {
                        allowed < count * 200 ? approveBUSD() : mint();
                      }}
                    >
                      {allowed < count * 200 ? "Approve" : "Mint Now"}
                    </Button>
                  )
                ) : (
                  <Button
                    href="https://metamask.app.link/dapp/cryptorambo.io/mint/"
                    color="inherit"
                    // variant="contained"
                    className={classes.menuButton}
                    disabled={!count}
                  >
                    {allowed < count * 200 ? "Approve" : "Mint Now"}
                  </Button>
                )
              ) : (
                // active ? <Button color="inherit" variant="outlined" className={classes.menuButton} disabled={!count} onClick={mint} >Mint Now</Button> :
                //   <Button color="inherit" variant="outlined" className={classes.menuButton} onClick={connect} >Connect Wallet</Button>
                <Button
                  color="inherit"
                  // variant="contained"
                  className={classes.menuButton}
                  onClick={() => {
                    allowed < count * 200 ? approveBUSD() : mint();
                  }}
                  disabled={!count}
                >
                  {allowed < count * 200 ? "Approve" : "Mint Now"}
                </Button>
              )}
            </Typography>
            <Typography variant="h5" className={classes.mint}>
              NFTs You Own: {currentBalance}
            </Typography>
          </Typography>
        </Grid>
        <Grid
          item
          lg={5}
          style={{
            justifyContent: "center",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <Typography component="div" className={classes.imgContainer}>
            {/* <img
              className={classes.img}
              src={banner}
              alt={"collage"}
              style={{ borderRadius: 30 }}
            /> */}
            <video
              src={videoSrc}
              width="100%"
              muted="true"
              autoplay="true"
              loop="true"
              style={{ borderRadius: 30 }}
            />
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default TopSection;
