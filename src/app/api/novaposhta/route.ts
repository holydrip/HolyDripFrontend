import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, query, cityRef } = await req.json();

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
            Limit: "15",
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
      }));

      return NextResponse.json({ success: true, cities });
    }

    if (action === "warehouses") {
      if (!cityRef) {
        return NextResponse.json({ success: false, warehouses: [] });
      }

      const searchStr = (query || "").trim();
      const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityRef: cityRef,
            FindByString: searchStr,
            Limit: "300",
            Page: "1",
          },
        }),
      });

      const data = await res.json();
      const items = (data?.data || []).map((w: any) => ({
        ref: w.Ref,
        description: w.Description,
        number: w.Number,
        category: w.CategoryOfWarehouse,
      }));

      return NextResponse.json({ success: true, warehouses: items });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Nova Poshta API Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
