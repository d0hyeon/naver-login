
# NAVER LOGIN

```
    yarn add @dohyeon/react-naver-login
```


## Component

```jsx

import NaverLogin from '@dohyeon/react-naver-login';

<NaverLogin
    clientId="..."
    callbackUrl="..."
    isPopup={true | false}
    callbackHandle={true | false}
>
    <button>Login!</button>
</NaverLogin>

or

<NaverLogin
    clientId="..."
    callbackUrl="..."
    isPopup={true | false}
    callbackHandle={true | false}
    loginButton={{color: string, type: 1 | 2 | 3, height: number}}
/>

```

## Hooks

#### LoginPage.jsx

```jsx
import {useNaverLogin} from '@dohyeon/react-naver-login';

const Login = () => {
    const {naverLoginInit, loading} = useNaverLogin({
        clientId: "..."
        callbackUrl: "..."
        isPopup: true | false,
        callbackHandle: true | false
    });

    // loading<boolean> -> script loading value
    // https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js

    if(!loading) {
        naverLoginInit();
    }

    return (
        <>
            <div id="naverIdLogin"/>
        </>
    )
}

```

#### callbackPage.jsx

```jsx
import {useNaverLogin} from '@dohyeon/react-naver-login';

const LoginAuth = () => {
    const {naverLoginInit, loading} = useNaverLogin({
        clientId: "..."
        callbackUrl: "..."
        isPopup: true | false,
        callbackHandle: true | false
    });
    
    if(!loading) {
        const naverLoginInstance = naverLoginInit();

        naverLoginInstance.getLoginStatus(status => {
            if(status) {
                console.log('success!');
            } else {
                console.log('fail!');
            }
        })
    }
}

```