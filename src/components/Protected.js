import {React} from 'react';
import {useHistory} from 'react-router-dom';

export default function Protected(props) {
  const history = useHistory();
  const Cmp = props.Cmp
  return (
    <>
      {
        !localStorage.getItem('token') ? ( history.push('/login') )  : <Cmp></Cmp>
      }
    </>
  );
}