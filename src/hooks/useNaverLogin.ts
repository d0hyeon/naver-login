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
  naverLogin: TNaverLogin;
  naverLoginInit: TNaverLogin
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
  const naverLogin = React.useMemo(() => {
    if(window.naver.LoginWithNaverId) {
      return new window.naver.LoginWithNaverId(
        {
          clientId,
          callbackUrl,
          isPopup,
          loginButton,
          callbackHandle
        }
      );
    }

    return null;
  }, [isLoadedScript]);

  const naverLoginInit = React.useCallback(() => {
    setTimeout(() => {
      naverLogin && naverLogin.init()
    }, 0);
    
    return naverLogin;
  }, [isLoadedScript, naverLogin]);


  React.useEffect(() => {
    if(!isLoadedScript) {
      createScript(() => {
        loopTimeout(() => {
          if(getIsNaverLoaded()) {
            setIsLoadedScript(true);
            return true;
          } 

          return false;
        }, 300);
      });
    }
  }, []);
  
  return {
    loading: !isLoadedScript,
    naverLogin,
    naverLoginInit,
  }
};

export default useNaverLogin;