import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import UserInfo from "@/components/shopping-view/user-info";
import UserSettings from "@/components/shopping-view/user-settings";
import PropTypes from "prop-types";
import { useState } from "react";

function ShoppingAccount() {
  const [selectedAccountAddress, setSelectedAccountAddress] = useState(null);
  return (
    <div className="flex flex-col">
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 max-[850px]:p-0 max-[850px]:gap-0 max-[850px]:mx-0">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm max-[850px]:p-3 max-[850px]:rounded-none max-[850px]:border-x-0">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full grid grid-cols-4 max-sm:gap-1 max-sm:p-1">
              <TabsTrigger value="orders" className="max-sm:text-xs">Siparişler</TabsTrigger>
              <TabsTrigger value="address" className="max-sm:text-xs">Adresler</TabsTrigger>
              <TabsTrigger value="info" className="max-sm:text-xs">Bilgilerim</TabsTrigger>
              <TabsTrigger value="settings" className="max-sm:text-xs">Ayarlar</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4 max-sm:mt-2">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-4 max-sm:mt-2">
              <Address
                seciliAdresProp={selectedAccountAddress}
                setCurrentSelectedAddress={setSelectedAccountAddress}
              />
            </TabsContent>
            <TabsContent value="info" className="mt-4 max-sm:mt-2">
              <UserInfo />
            </TabsContent>
            <TabsContent value="settings" className="mt-4 max-sm:mt-2">
              <UserSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
Address.propTypes = {
  setCurrentSelectedAddress: PropTypes.func,
  seciliAdresProp: PropTypes.object,
};
export default ShoppingAccount;
