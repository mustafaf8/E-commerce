import "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

function UserSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleLogout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/shop/home");
        toast({ title: "Çıkış yapıldı", variant: "success" });
      })
      .catch((error) => {
        toast({ title: "Çıkış yapılamadı", variant: "destructive" });
        console.error("Çıkış hatası:", error);
      });
  }

  return (
    <div className="p-10 max-[1024px]:p-1">
      <Button onClick={handleLogout}>Çıkış Yap</Button>
    </div>
  );
}

export default UserSettings;
