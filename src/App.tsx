import productionList from "./data/production.json";
import areaList from "./data/area.json";
import itemList from "./data/item.json";
import questList from "./data/quest.json";
import { Dropdown } from "primereact/dropdown";
import { DataView } from "primereact/dataview";
import { Panel } from "primereact/panel";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { saveAs } from "file-saver";

interface Item {
  name: string;
  shortname: string;
  description: string;
}

interface Area {
  name: string;
  areaId: number;
  maxLevel: number;
}

interface Requirement {
  areaType?: number;
  requiredLevel?: number;
  templateId?: string;
  count?: number;
  isFunctional?: boolean;
  isEncoded?: boolean;
  type: "Area" | "Item" | "QuestComplete" | "Tool" | "Resource" | "GameVersion";
  questId?: string;
}

interface Production {
  _id: string;
  areaType: number;
  requirements: Requirement[];
  productionTime: number;
  needFuelForAllProductionTime: boolean;
  locked: boolean;
  endProduct: string;
  continuous: boolean;
  count: number;
  productionLimitCount: number;
  isEncoded: boolean;
  isCodeProduction: boolean;
}

export const App = () => {
  const [selectedArea, setSelectedArea] = useState<Area>(areaList[0]);
  const [searchItemName, setSearchItemName] = useState<string>("");
  const itemTemplate = (item: Production) => {
    const panelHeader = (item: Production) => {
      return (
        <>
          <span className="font-bold">
            {itemList[item.endProduct as keyof typeof itemList].name}
          </span>
          <span className="font-light"> ID: {item._id}</span>
        </>
      );
    };
    const requirmentsPanel = (requ:Requirement) => {
      const handleRequirment = (requ:Requirement) => {
        switch (requ.type) {
          case "Area":
            return (
              <div className="grid grid-nogutter ml-2 col-10">
                <span className="col-12">
                  Area:{" "}
                  {areaList.find((area) => area.areaId === requ.areaType)?.name}
                </span>
                <span className="col-12">
                  Area level needed: {requ.requiredLevel} /{" "}
                  {
                    areaList.find((area) => area.areaId === requ.areaType)
                      ?.maxLevel
                  }
                </span>
              </div>
            );
          case "Item":
            return (
              <div className="grid grid-nogutter ml-2 col-10">
                <span className="col-12">
                  Item: {itemList[requ.templateId].name}
                </span>
                <span className="col-2">Needed: {requ.count}</span>
              </div>
            );
          case "QuestComplete":
            return (
              <div className="grid grid-nogutter ml-2 col-10">
                <span className="col-12">
                  Quest to Complete: {questList[requ.questId]}
                </span>
              </div>
            );
          default:
            return "Not implemented yet";
        }
        return <></>;
      };
      return (
        <div className="col-12">
          <span className="col-2">Type: {requ.type}</span>
          {handleRequirment(requ)}
        </div>
      );
    };
    return (
      <Panel
        toggleable
        collapsed
        key={item._id}
        className="col-12"
        header={panelHeader(item)}
      >
        <span className="col-12"> Produces: {item.count} </span>
        <span className="col-2"> Time(s): {item.productionTime} </span>
        <DataView
          value={item.requirements}
          header="Requirments"
          itemTemplate={requirmentsPanel}
        />
      </Panel>
    );
  };
  const dataViewHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <span>Production area</span>
          <Dropdown
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.value);
            }}
            options={areaList}
            optionLabel="name"
            placeholder="Select an Area"
            className="mx-2"
          />
        </div>
        <div>
          <span className="pr-3">Global search</span>
          <InputText
            value={searchItemName}
            onChange={(e) => setSearchItemName(e.target.value)}
            placeholder="Search for itemname"
          />
        </div>
      </div>
    );
  };
  const filterDataView = (craft: Production) => {
    if (searchItemName === "") {
      return craft.areaType === selectedArea.areaId;
    }
    return itemList[craft.endProduct as keyof typeof itemList].name
      .toLowerCase()
      .includes(searchItemName.toLowerCase());
  };
  return (
    <>
      <Button
        label="Save"
        onClick={async () => {
          const blob = new Blob([JSON.stringify(productionList, null, 2)], {
            type: "application/json",
          });
          saveAs(blob, "test.json");
        }}
      />
      <DataView
        value={productionList.filter((craft) => filterDataView(craft))}
        itemTemplate={itemTemplate}
        header={dataViewHeader()}
        paginator
        rows={12}
        className="m-1"
      />
    </>
  );
};
