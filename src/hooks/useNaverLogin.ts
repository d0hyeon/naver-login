import * as React from 'react';
import {INaverLoginProperties} from '../@types/naverLogin';

declare global {
  interface Window {
    naver: any
  }
}
 
const NAVER_SCRIPT_SRC = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js';

const createScript = (callback?: () => void) => {
  const script = document.createElement('script');
  script.src = NAVER_SCRIPT_SRC;
  script.onload = () => {
    callback && callback();
  }  
  document.body.appendChild(script);
};

const useNaverLogin = ({
  clientId,
  callbackUrl,
  isPopup,
  loginButton = {color: "green", type: 2, height: 42},
  callbackHandle = true
}: INaverLoginProperties) => {
  const [isLoadedScript, setIsLoadedScript] = React.useState<boolean>(window.naver.LoginWithNaverId ? true : false);
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
        setIsLoadedScript(true);
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