import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import UserInfo from "@/components/shopping-view/user-info"; // Import the new component
import UserSettings from "@/components/shopping-view/user-settings"; // Import the new component

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 max-[850px]:p-0 max-[850px]:gap-0 max-[850px]:mx-0">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm max-[850px]:p-3">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Siparişler</TabsTrigger>
              <TabsTrigger value="address">Adresler</TabsTrigger>
              <TabsTrigger value="info">Bilgilerim</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
            <TabsContent value="info">
              <UserInfo /> {/* Render the new component */}
            </TabsContent>
            <TabsContent value="settings">
              <UserSettings /> {/* Render the new component */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
