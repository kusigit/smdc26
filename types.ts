type UserData = {
  kpi: any[];
  level: number;
  parent: string;
  text: string;
  figure: string;
  bgColor: string;
  buttons: any[];
  typeId: string;
  inputLeft: boolean;
  inputTop: boolean;
  inputRight: boolean;
  inputBottom: boolean;
  outputLeft: boolean;
  outputTop: boolean;
  outputRight: boolean;
  outputBottom: boolean;
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

export { Attribute, UserData };
