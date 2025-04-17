// Interfaz para documentos de MongoDB
export interface Note {
  _id?: {
    $oid: string;
  };
  title: string;
  content: string;
  tags: string[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v?: number;
}
