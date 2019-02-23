/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: PASSWORD IS NOT STRING
        2: THERE IS NO USER
        3: PASSWORD IS NOT CORRECT
*/

router.post('/signin', (req, res) => {
    // 비밀번호 데이터 타입 검사 (문자열인지 아닌지)
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "PASSWORD IS NOT STRING",
            code: 1
        });
    }
 
    // FIND THE USER BY USERNAME
    // Model.findOne 메소드로 username 이 같은 DB 검색 (첫번째 인자 : Query)
    Account.findOne({ username: req.body.username}, (err, account) => {
        if(err) throw err;
 
        // CHECK ACCOUNT EXISTANCY
        // 검색 결과가 존재하지 않는 경우
        if(!account) {
            return res.status(401).json({
                error: "THERE IS NO USER",
                code: 2
            });
        }
 
        // CHECK WHETHER THE PASSWORD IS VALID
        // 유저검색 결과가 있으면 검사 salt값으로 해쉬
        const validate = hasher({password:req.body.password, salt:account.salt}, function(err, pass, salt, hash){
          // 입력한 비밀번호를 이용해 만는 해쉬와 DB에 저장된 비밀번호가 같을 경우
          if(hash === account.password){
            let session = req.session;
            session.loginInfo = {
                _id: account._id,
                username: account.username
            };
 
            // RETURN SUCCESS
            return res.json({
                success: true
            });
          }else{
            // 다른 경우
            return res.status(401).json({
                error: "PASSWORD IS NOT CORRECT",
                code: 3
            });
          }
        });
 
    });
});
