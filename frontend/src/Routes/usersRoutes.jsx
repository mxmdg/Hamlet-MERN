import { Route } from "react-router-dom";
import MainContainer from "../Components/General/MainContainer";
import { Register } from "../Components/Users/Register";
import { Profile } from "../Components/Users/Profile";
import ChangePassword from "../Components/Users/ChangePassword";
import FormMaterial from "../Components/Formulario/FormMaterial";
import UsersDataForm from "../Components/Formulario/UsersDataForm";

export const usersRoutes = () => (
  <>
    <Route path="/users" element={<MainContainer entity={"users"} />} />
    <Route path="/users/add" element={<Register />} />
    <Route path="/users/profile" element={<Profile />} />
    <Route path="/users/ChangePassword" element={<ChangePassword />} />
    <Route
      path="/users/edit/:id"
      element={
        <FormMaterial form={UsersDataForm} collection="users" task="edit" />
      }
    />
  </>
);
