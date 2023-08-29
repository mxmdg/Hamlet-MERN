const Home = () => {
  const getToken = () => {
    const tkn = localStorage.getItem("token");
    return tkn;
  };

  return (
    <div>
      <h3>Welcome to hamlet</h3>
      <h6>Token: {getToken()}</h6>
    </div>
  );
};

export default Home;
