import { Container } from "../../components/formComponents";
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";
import exit from "../../assets/exit.svg";
import { useNavigate } from "react-router";
import {
  Header,
  EntriesScreen,
  Buttons,
  EntrieButton,
  Entries,
  Value,
  Balance,
} from "../../components/Homecomponents";
import { useContext, useEffect, useState } from "react";
import authContext from "../../contexts/authContext";
import api from "../../services/api";

export default function Home() {
  let navigate = useNavigate();
  const { userData } = useContext(authContext);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getEntries();
  }, []);

  async function getEntries() {
    const headers = { headers: { Authorization: `Bearer ${userData.token}` } };
    try {
      const dataEntries = await api.getRecords(headers);
      setEntries(dataEntries.data);
    } catch (error) {
      console.log(error);
    }
  }
  let balance = 0;
  return (
    <Container>
      <Header>
        <h1>{`Olá ${userData.name}`}</h1>
        <img src={exit} alt="sair" onClick={() => navigate("/")}></img>
      </Header>
      <EntriesScreen>
        <div>
          {entries.length === 0 ? (
            <h1>Não há registros de entrada ou saída</h1>
          ) : (
            entries.map(({ date, description, value }, index) => {
              balance += value;
              return (
                <Entries key={index}>
                  <div>
                    <p>{date.slice(0, -5)}</p>
                    <p>{description}</p>
                  </div>
                  <Value hasColor={value >= 0}>
                    {Math.abs(value).toFixed(2)}
                  </Value>
                </Entries>
              );
            })
          )}
        </div>
        <Balance hasColor={balance >= 0}>
          <p>SALDO</p>
          <p>{Math.abs(balance).toFixed(2)}</p>
        </Balance>
      </EntriesScreen>
      <Buttons>
        <EntrieButton onClick={() => navigate(`/entries/input`)}>
          <img src={plus} alt="plus"></img>
          <p>Nova entrada</p>
        </EntrieButton>
        <EntrieButton onClick={() => navigate(`/entries/output`)}>
          <img src={minus} alt="minus"></img>
          <p>Nova saída</p>
        </EntrieButton>
      </Buttons>
    </Container>
  );
}
