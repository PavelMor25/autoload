



function App() {
  async function getAllUsers() {
    const resp = await fetch('/api/login/userAuth', {
      method: 'POST'
    })
    return await resp.json()
  }
  const res = React.useMemo(async()=>await getAllUsers())
  console.log(res);
  return(
    <h1>Привет, мир!</h1>
  )
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );