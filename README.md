# Express Project - 2022/08/12
-----------------------------------
## 프로젝트 계획이유

```
전 프로젝트의 경우 express를 대신 http모듈을 활용했습니다. 
Cloud App Content Project당시 express를 이용해보고 express가 http보다 매력적으로 느껴져 
http로 진행한 프로젝트를 축소하여 진행하게 되었습니다.

이 프로젝트는 글을 생성, 삭제, 수정 하는 기능을 포함하고 있으며 
db는 이용하지 않아 글에 관한 내용은 data 디렉토리에 따로 보관하고있습니다.

v.3.0.0은 session 기능을 이용한 로그인 기능이 구현되어있습니다. 
```

## 실행설명
-----------------------------------
+ 실행 파일 이름 : main.js
    + 실행 방법
    
    ```
    node main.js
    ```

## 프로젝트 기능 설명
-----------------------------------
### [글 생성, 삭제, 수정]
    
    1. 생성 : create버튼을 이용하여 글을 생성하는 페이지로 이동합니다. 

              제목, 내용을 입력할 수 있습니다.
    
    2. 삭제 : delete버튼을 이용하여 글을 삭제가능합니다. 

              삭제할 글을 클릭하셔서 해당 페이지로 이동하시면 버튼이 존재합니다.
    
    3. 수정 : update버튼을 이용하여 글을 수정합니다. 버튼 클릭시 제목, 내용은 현재 글의 내용을 담고 있습니다. 

              삭제와 마찬가지로 수정할 글의 페이지로 이동하셔야 버튼이 존재합니다.

### [Login]

    1. Login : 로그인이 가능합니다.
    
    2. Logout  : 로그아웃이 가능합니다.

    로그인이 되지 않으면 글을 생성, 삭제, 수정이 불가합니다. 아래 email과 password로 로그인이 가능합니다.

    email : abcde1234@naver.com

    password : 1111
