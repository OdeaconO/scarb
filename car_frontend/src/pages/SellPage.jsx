import { useNavigate } from "react-router-dom";
import ListingForm from "../components/ListingForm";

export default function SellPage() {
  const navigate = useNavigate();

  function onListingAdded() {
    navigate("/");
  }
  return (
    <div className="nes-container is-dark">
      <h2>Sell Your Car</h2>
      <ListingForm onListingAdded={onListingAdded} />
    </div>
  );
}
