const API_HOST = 'http://localhost:8000'

const logout =  () => {
    alert('ログアウトされました、ログインページに移動します')
    localStorage.removeItem('token')
    location.href = 'login.html'
}

const handleLoginError = () =>{
    alert('ログイン情報が確認できませんでした、ログインページに移動します')
    logout()
}

const handleForbiddenError = () =>{
    alert('だめです')
    throw new Error('だめだよ')
}

const handleOtherError = () =>{
    alert('予期せぬエラーが発生しました')
    throw new Error ('予期せぬエラーが発生しました')
}


//新規登録API
const signUpApi = (data) => {
    const url = `${API_HOST}/user`
    console.log("daaddd")
    return fetch(url,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => {
    if (res.ok) {
      return res.json()
    } else if (res.status === 400) {
      console.error(res)
      throw new Error('入力されたメールアドレスは既に登録されています')
    } else {
      console.error(res)
      handleOtherError()
    }
    })
}

//ログインAPI
const loginApi = (email,password) => {
    const url = `${API_HOST}/token`
    return fetch(url,{
        method: 'POST',
        cledential: 'include',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${email}&password=${password}`,
    }).then((res) => {
        if (res.ok){
            return res.json()
        } else if (res.status === 401){
            console.error(res)
            throw new Error('メールアドレスまたはパスワードが間違っています')
        } else {
            console.error(res)
            handleOtherError()
        }
    }) 
    .then((data) => {
        localStorage.setItem('token',data.access_token)
        return data
    })
}

//ログインユーザー情報取得するAPI
const getMeApi = () => {
    const url = `${API_HOST}/me`
    return fetch(url,{
        method:'GET',
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => {
        if (res.ok){
            return res.json()
        }else if (res.status === 401){
            handleLoginError()
        }else{
            console.error(res)
            handleOtherError()
        }
    })
}

//単語をDBに保存するAPI
const saveNewWords = (data) => {
  const url = `${API_HOST}/words`
  console.log(data);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else if (res.status === 401) {
    } else {
      console.error(res)
      handleOtherError()
    }
  })
}

//自分の単語情報を習得するAPI
const getYourWordsApi = () => {
  const url = `${API_HOST}/words`
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else if (res.status === 401) {
      handleLoginError()
    } else {
      console.error(res)
      handleOtherError()
    }
  })
}

//自分の単語の日本語の意味を取得するAPI
const getYourWordsmeanApi = () =>{
    const url = `${API_HOST}/words`
    return fetch(url,{
        method: 'GET',
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => {
        if (res.ok){
            return res.json()
        } else if (res.status === 401){
            handleLoginError()
        } else {
            console.error(res)
            handleOtherError()
        }
    })
}