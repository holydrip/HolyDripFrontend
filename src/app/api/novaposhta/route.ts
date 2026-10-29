import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, query, cityRef, settlementRef } = await req.json();

    if (action === "cities") {
      const cityName = (query || "").trim();
      const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: cityName || "Київ",
            Limit: "25",
            Page: "1",
          },
        }),
      });

      const data = await res.json();
      const addresses = data?.data?.[0]?.Addresses || [];
      const cities = addresses.map((a: any) => ({
        present: a.Present,
        name: a.MainDescription,
        area: a.Area,
        ref: a.DeliveryCity,
        settlementRef: a.Ref,
        settlementType: a.SettlementTypeCode,
        warehousesCount: a.Warehouses,
      }));

      return NextResponse.json({ success: true, cities });
    }

    if (action === "warehouses") {
      if (!cityRef && !settlementRef) {
        return NextResponse.json({ success: false, warehouses: [] });
      }

      const searchStr = (query || "").trim();
      const methodProperties: Record<string, string> = {
        Limit: "500",
        Page: "1",
      };

      if (cityRef) methodProperties.CityRef = cityRef;
      if (settlementRef) methodProperties.SettlementRef = settlementRef;
      if (searchStr) methodProperties.FindByString = searchStr;

      let res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties,
        }),
      });

      let data = await res.json();
      let rawItems = data?.data || [];

      // If CityRef yielded nothing but settlementRef exists, try with only SettlementRef
      if (rawItems.length === 0 && settlementRef && methodProperties.CityRef) {
        delete methodProperties.CityRef;
        res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties,
          }),
        });
        data = await res.json();
        rawItems = data?.data || [];
      }

      const items = rawItems.map((w: any) => ({
        ref: w.Ref,
        description: w.Description,
        number: w.Number,
        category: w.CategoryOfWarehouse || (w.Description?.toLowerCase().includes("поштомат") ? "Postomat" : "Branch"),
      }));

      return NextResponse.json({ success: true, warehouses: items });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Nova Poshta API Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
