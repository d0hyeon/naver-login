import * as React from 'react';
import {INaverLoginProperties} from '../@types/naverLogin';
import {NAVER_SCRIPT_SRC} from './../lib/constants';
import loopTimeout from '../lib/loopTimeout';

declare global {
  interface Window {
    naver: any
  }
}
 
type TNaverLogin = any;

interface IUserNaverLoginResult {
  loading: boolean;
  naverLoginInit: () =>TNaverLogin
}

type TUserNaverLogin = (parameter: INaverLoginProperties) => null | IUserNaverLoginResult;

const createScript = (callback?: () => void) => {
  const script = document.createElement('script');
  script.src = NAVER_SCRIPT_SRC;
  script.onload = () => {
    callback && callback();
  }  
  document.body.appendChild(script);
};

const getIsNaverLoaded = () => window.naver.LoginWithNaverId ? true : false;

const useNaverLogin:TUserNaverLogin = ({
  clientId,
  callbackUrl,
  isPopup,
  loginButton = {color: "green", type: 2, height: 42},
  callbackHandle = true
}) => {
  if(!('browser' in process)) {
    return null;
  }
  const [isLoadedScript, setIsLoadedScript] = React.useState<boolean>(getIsNaverLoaded());

  const naverLoginInit = React.useCallback(() => {
    if(getIsNaverLoaded()) {
      const naverLogin = new window.naver.LoginWithNaverId(
        {
          clientId,
          callbackUrl,
          isPopup,
          loginButton,
          callbackHandle
        }
      );

      naverLogin.init();
      return naverLogin;
    }
    
    return null;
  }, [isLoadedScript]);

  React.useEffect(() => {
    if(!isLoadedScript) {
      createScript(() => {
        loopTimeout(() => {
          if(getIsNaverLoaded()) {
            setIsLoadedScript(true);
            return true;
          } 

          return false;
        }, 500);
      });
    }
  }, []);
  
  return {
    loading: !isLoadedScript,
    naverLoginInit,
  }
};

export default useNaverLogin;