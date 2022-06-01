type UserData = {
  kpi: any[];
  level: number;
  parent: string;
  text: string;
  figure: string;
  bgColor: string;
  buttons: any[];
  typeId: string;
  ports: number[];
};

type Attribute = {
  id: string;
  // name: string;
  height: number;
  width: number;
  x: number;
  y: number;
  userData: UserData;
};

type Connection = {
  id: string;
  source: {
    id: string;
    parentId: string;
    position: string;
  };
  target: {
    id: string;
    parentId: string;
    position: string;
  };
};

export { Attribute, Connection, UserData };
