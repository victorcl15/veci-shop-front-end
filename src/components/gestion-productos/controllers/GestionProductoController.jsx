import { useEffect, useState } from "react";
import { GestionProducto } from "../modules/GestionProducto";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getCategorias,
  getProductosPorUsuario,
  getSubCategoriasPorCategoria,
  getSubCategoriaNinguno,
} from "../services/gestionProducto";
import { ModalEditarProducto } from "../modules/ModalEditarProducto";
import { ModalCrearProducto } from "../modules/ModalCrearProducto";
import { ModalEliminarProducto } from "../modules/ModalEliminarProducto";
import { useLogin } from "../../../context";

export function GestionProductoController() {
    const { usuario, login, logout } = useLogin()
  const [productosUsuario, setProductosUsuario] = useState([]);
  const [tiposCategorias, setTiposCategorias] = useState([]);
  const [tiposSubCategorias, setTiposSubCategorias] = useState([]);
  const [tiposSubCategoriaNinguno, setTiposSubCategoriaNinguno] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [recoveredData, setRecoveredData] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [newData, setNewData] = useState({});
  const [defaultData, setDefaultData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [infoDelete, setInfoDelete] = useState({})
  const [isFormModified, setIsFormModified] = useState(false);
  const requestProductosPorUsuario = async (id) => {

      const arrayProductos = await getProductosPorUsuario(id);
      if(arrayProductos.status !== false) {
        if(Array.isArray(arrayProductos)) {

          console.log(arrayProductos);
          //console.log(arrayProductos);
          setProductosUsuario(arrayProductos);
        } else {
          setProductosUsuario([]);
        }
    } else {
      setProductosUsuario([]);
    }
  };

  const requestCategorias = async () => {
    const arrayCategorias = await getCategorias();

    //console.log(arrayCategorias);
    //setTiposCategorias(arrayCategorias);

    if(arrayCategorias.status !== false) {
      if(Array.isArray(arrayCategorias)) {

        console.log(arrayCategorias);
        //console.log(arrayProductos);
        setTiposCategorias(arrayCategorias);
      } else {
        return;
      }
  } else {
    setTiposCategorias([]);
  }
  };

  const requestSubCategorias = async (id) => {
    const arraySubCategorias = await getSubCategoriasPorCategoria(id);

    //console.log(arrayCategorias);
    //setTiposCategorias(arrayCategorias);

    if(arraySubCategorias.status !== false) {
      if(Array.isArray(arraySubCategorias)) {

        console.log(arraySubCategorias);
        //console.log(arrayProductos);
        setTiposSubCategorias(arraySubCategorias);
      } else {
        return;
      }
  } else {
    setTiposSubCategorias([]);
  }
  };

  const requestSubCategoriaNinguno = async () => {
    const arraySubCategorias = await getSubCategoriaNinguno();

    //console.log(arrayCategorias);
    //setTiposCategorias(arrayCategorias);

    if(arraySubCategorias.status !== false) {
      if(Array.isArray(arraySubCategorias)) {

        console.log(arraySubCategorias[0]._id);
        //console.log(arrayProductos);
        setTiposSubCategoriaNinguno(arraySubCategorias[0]._id);
      } else {
        return;
      }
  } else {
    setTiposSubCategoriaNinguno("");
  }
  };

  const requestEditarProducto = async (id, editProducto) => {
    const productoActualizado = await actualizarProducto(id, editProducto);
    console.log(productoActualizado);
    //setTiposCategorias(arrayCategorias);
  };

  const requestCrearProducto = async (newProducto) => {
    const productoCreado = await crearProducto(newProducto);
    console.log(productoCreado);
    //setTiposCategorias(arrayCategorias);
  };

  const requestEliminarProducto = async (idProducto) => {
    const productoEliminar = await eliminarProducto(idProducto);
    await requestProductosPorUsuario(usuario._id);
    console.log(productoEliminar);
    //setTiposCategorias(arrayCategorias);
  };

  const handleOpenNew = (event) => {
    //console.log(event.currentTarget.dataset);
    //console.log(event.target.dataset.nombre);
    event.preventDefault();
    setOpenNew(true);
    setIsDisabled(false);
    requestCategorias();
    requestSubCategoriaNinguno();
    //const { dataset } = event.currentTarget;
    const data = {
      nombre: "",
      precio: "",
      stock: "",
      categoria: "",
      sub_categoria: "",
      usuario: usuario._id,
      img: "",
      descripcion: "",
    };
    setDefaultData(data);
    setNewData(data);
    console.log(data);
  };

  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseNew = () => setOpenNew(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleOpenEdit = (event, row) => {
    event.preventDefault();
    setOpenEdit(true);
    console.log("Editar producto", row.nombre);
    console.log("Atributo personalizado:", event.currentTarget.dataset.id);
    requestSubCategoriaNinguno();
    const { dataset } = event.currentTarget;
    requestSubCategorias(row.categoria_id);
    const data = {
      id: dataset.id,
      nombre: row.nombre,
      precio: row.precio,
      stock: row.stock,
      sub_categoria: row.sub_categoria_id,
      usuario: row.usuario._id,
      img: row.img,
      descripcion: row.descripcion,
    };
    console.log(JSON.stringify(data));
    setRecoveredData(data);
    setEditedData(data);
    //console.log(data);
  };

  const handleOpenDelete = (event, row) => {
    event.preventDefault();
    console.log("Editar producto", row);
    console.log("Atributo personalizado:", event.currentTarget.dataset.id);
    setInfoDelete(row);
    setOpenDelete(true);
  };
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    console.log(`ID: ${infoDelete.id}`);
    requestEliminarProducto(infoDelete.id);
    //requestProductosPorUsuario(usuario._id);
    handleCloseDelete();
  };
  const getFieldValueEdit = (fieldName) => {
    return editedData[fieldName];
  };
  const handleFieldChangeEdit = (fieldName, value) => {
    setEditedData({
      ...editedData,
      [fieldName]: value,
    });
  };

  const getFieldValueNew = (fieldName) => {
    return newData[fieldName];
  };

  const handleFieldChangeNew = (fieldName, value) => {
    if(value === "665551ca4550954cc0b8ce27"){
      setNewData({
        ...newData,
        [fieldName]: value,
        sub_categoria: tiposSubCategoriaNinguno
      });
    } else if(fieldName === "categoria" && value !== "665551ca4550954cc0b8ce27") {
      setNewData({
        ...newData,
        [fieldName]: value,
        sub_categoria: ""
      });
    } else if(fieldName === "categoria" && value === "") {
      setNewData({
        ...newData,
        [fieldName]: value,
        sub_categoria: ""
      });
    } else {

      setNewData({
        ...newData,
        [fieldName]: value,
      });
    }
    console.log(value);
  };

  const handleFieldChangeNewSubCategoria = (fieldName, value) => {
    setNewData({
      ...newData,
      [fieldName]: value,
    });
    console.log(value);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const { id } = editedData;
    console.log("Formulario enviado:", editedData);
    await requestEditarProducto(id, editedData);
    await requestProductosPorUsuario(usuario._id);
    handleCloseEdit();
  };
  const handleSubmitNew = async (e) => {
    e.preventDefault();

    console.log("Formulario enviado:", newData);
    await requestCrearProducto(newData);
    await requestProductosPorUsuario(usuario._id);
    handleCloseNew();
  };

  useEffect(() => {
    requestProductosPorUsuario(usuario._id);
    console.log(usuario);
  }, []);
  useEffect(() => {
    // Comprueba si algún campo ha cambiado desde los valores iniciales
    const hasFormChanged = Object.keys(editedData).some(
      (fieldName) => editedData[fieldName] !== recoveredData[fieldName]
    );

    const isAnyFieldEmpty = Object.values(editedData).some(
      (value) => value === ""
    );

    setIsFormModified(!isAnyFieldEmpty && hasFormChanged);
  }, [editedData]);

  useEffect(() => {
    // Comprueba si algún campo ha cambiado desde los valores iniciales
    //const hasFormChanged = Object.keys(newData).some((fieldName) => newData[fieldName] !== "");
    const requiredFields = [
      "nombre",
      "precio",
      "stock",
      "categoria",
      "sub_categoria",
      "usuario",
      "img",
      "descripcion",
    ];
    const someFieldIsEmpty = requiredFields.some(
      (fieldName) => !newData[fieldName]
    );
    setIsFormModified(someFieldIsEmpty);
    console.log(someFieldIsEmpty);
  }, [newData]);
  return (
    <>
      <GestionProducto
        productosUsuario={productosUsuario}
        handleOpenEdit={handleOpenEdit}
        handleOpenDelete={handleOpenDelete}
        handleOpenNew={handleOpenNew}
      ></GestionProducto>
      <ModalEditarProducto
        open={openEdit}
        handleClose={handleCloseEdit}
        isFormModified={isFormModified}
        isDisabled={isDisabled}
        getFieldValue={getFieldValueEdit}
        handleFieldChange={handleFieldChangeEdit}
        handleSubmit={handleSubmitEdit}
        tiposSubCategorias={tiposSubCategorias}
      ></ModalEditarProducto>
      <ModalCrearProducto
        open={openNew}
        handleClose={handleCloseNew}
        isFormModified={isFormModified}
        isDisabled={isDisabled}
        getFieldValue={getFieldValueNew}
        handleFieldChangeNewSubCategoria={handleFieldChangeNewSubCategoria}
        handleFieldChange={handleFieldChangeNew}
        handleSubmit={handleSubmitNew}
        tiposCategorias={tiposCategorias}
        tiposSubCategorias={tiposSubCategorias}
        tiposSubCategoriaNinguno={tiposSubCategoriaNinguno}
        requestSubCategorias={requestSubCategorias}
      ></ModalCrearProducto>
      <ModalEliminarProducto
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        infoDelete={infoDelete}
        handleSubmitDelete={handleSubmitDelete}
      ></ModalEliminarProducto>
    </>
  );
}
