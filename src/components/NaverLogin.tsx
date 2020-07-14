import * as React from 'react';
import styled from 'styled-components';
import {INaverLoginProperties} from '../@types/naverLogin';
import useNaverLogin from './../hooks/useNaverLogin';


interface INaverLoginProps extends INaverLoginProperties {
  children?: React.ReactChildren;
}

interface IRefObject<T> {
  readonly current: T | null;
}

const HiddenDiv = styled.div`
  display: none;
`

// @ts-ignore
const NaverLogin: React.FC<INaverLoginProps> = ({
  clientId,
  callbackUrl,
  loginButton = {color: "green", type: 2, height: 42},
  isPopup,
  callbackHandle = true,
  children
}) => {
  const {naverLoginInit, loading} = useNaverLogin({
    clientId,
    callbackUrl,
    loginButton,
    isPopup,
    callbackHandle
  });

  if(!loading) {
    naverLoginInit();
  }
  
  const buttonRef:IRefObject<HTMLDivElement> = React.useRef(null);

  return (
    <>
      {children ? (
        <>
          <div
            onClick={() => {
              const {current} = buttonRef;
              if(current !== null) {
                const a = current.querySelector('a');
                if(a) a.click();
              }
            }}
          >
            {children}
          </div>
          <HiddenDiv
            className="test"
          >
            <div 
              id="naverIdLogin"
              ref={buttonRef}
            />
          </HiddenDiv>
        </>  
      ) : (
        <div id="naverIdLogin"/>
      )}
    </>
  )
};

NaverLogin.displayName = 'NaverLogin';
export default React.memo(NaverLogin);

