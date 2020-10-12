import * as React from 'react';
import styled from 'styled-components';
import {INaverLoginProperties} from '../@types/naverLogin';
import useNaverLogin from '../hooks/useNaverLogin';


interface INaverLoginProps extends INaverLoginProperties {
  children?: React.ReactChildren;
}

interface IRefObject<T> {
  readonly current: T | null;
}

const NaverLoginDiv = styled.div<{hide: boolean}>`
  ${({hide}) => hide && `
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  `}
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
  if(!('browser' in process)) {
    return null;
  }
  const buttonRef:IRefObject<HTMLDivElement> = React.useRef(null);
  const {naverLoginInit, loading} = useNaverLogin({
    clientId,
    callbackUrl,
    loginButton,
    isPopup,
    callbackHandle
  }) || {};
  

  React.useEffect(() => {
    if(!loading && buttonRef.current) {
      naverLoginInit && naverLoginInit();
    }
  }, [loading, buttonRef]);
  
  return (
    <>
      {children && (
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
        </>  
      )}
      <NaverLoginDiv hide={!!children}>
        <div 
          id="naverIdLogin"
          ref={buttonRef}
        />
      </NaverLoginDiv>
    </>
  )
};

NaverLogin.displayName = 'NaverLogin';
export default React.memo(NaverLogin);

