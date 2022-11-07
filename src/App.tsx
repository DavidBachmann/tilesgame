import { ConfigProvider } from "./context/ConfigContext";
import { StoreCreator } from "./StoreCreator";

export default function App() {
  return (
    <ConfigProvider>
      <StoreCreator />
    </ConfigProvider>
  );
}
