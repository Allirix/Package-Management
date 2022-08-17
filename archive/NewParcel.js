// import { useState } from "react";
// import { useNewParcel } from "../../utils/hooks/useNewParcel";
// import { Parcel, Street } from "../Deliveries/DisplayStreets";
// import { colors, nonColor, imgs as imgs } from "../NewParcel/constants";
// import "./NewParcel.css";
// import { hammingDistance } from "../../utils";
// import { useDeliveryLocationsContext } from "../../utils/providers/LocationProvider";
// import { useNavigate } from "react-router-dom";

// import { MdArrowBackIos, MdClose, MdOutlineChevronRight } from "react-icons/md";

// export default function NewParcel() {
//   const np = useNewParcel();
//   const { newStreet, complete } = np;

//   const step = (() => {
//     switch (np.formState) {
//       case 0:
//         return <StreetNumberStep onClick={np.onClickLocation("number")} />;
//       case 1:
//         return <StreetNameStep next={np.next} setLocation={np.setLocation} />;
//       case 2:
//         return (
//           <ParcelTypeStep
//             title="Box Type"
//             list={["Bag", "Box"]}
//             onClickParcelSkip={np.onClickParcelSkip}
//             onClick={np.onClickParcel}
//             skip={np.skip}
//           />
//         );
//       case 3:
//         return (
//           <ParcelStep
//             title="Box Size"
//             list={["L", "M", "S"]}
//             onClick={np.onClickParcel("size")}
//           />
//         );
//       case 4:
//         return (
//           <ParcelStep
//             title="Box Colour"
//             list={colors}
//             onClick={np.onClickParcel("color")}
//           />
//         );
//       case 5:
//         return (
//           <FinalStep
//             notes={np.newStreet.notes}
//             nextParcel={np.nextParcel}
//             setValue={np.setValue}
//             complete={complete}
//           />
//         );
//       default:
//         return <>404 Error: Return to Home</>;
//     }
//   })();

//   return (
//     <div className="new-parcel">
//       <Street street={newStreet} toggle={complete("/deliveries")} />
//       <div className="content">{step}</div>
//     </div>
//   );
// }

// const StreetNumberStep = ({ onClick }) => {
//   const [number, setNumber] = useState("");
//   const onChange = (e) => {
//     e.preventDefault();
//     setNumber(e.target.value);
//   };
//   return (
//     <SingleInputForm
//       onSubmit={onClick(number)}
//       title="street number"
//       input={{ onChange, value: number, inputMode: "numeric" }}
//     />
//   );
// };

// const StreetNameStep = ({ next, setLocation }) => {
//   const { deliveryLocations } = useDeliveryLocationsContext();
//   const [name, setName] = useState("");

//   const onChange = (e) => setName(e.target.value);

//   const toDistance = (e) => ({
//     ...e,
//     d: hammingDistance(e.name.slice(0, name.length), name),
//   });

//   const l = deliveryLocations
//     .map(toDistance)
//     .sort((a, b) => a.d - b.d)
//     .slice(0, 10);

//   const onNext = (value) => (event) => {
//     return [event.preventDefault(), next(), setLocation(value), setName("")];
//   };

//   const streets = l.map((location, i) => (
//     <NameButton
//       key={`${i}-st`}
//       onClick={onNext(location)}
//       location={location}
//     />
//   ));

//   return (
//     <SingleInputForm
//       onSubmit={onNext(l[0])}
//       title="street name"
//       input={{ onChange, value: name }}
//     >
//       {streets}
//     </SingleInputForm>
//   );
// };

// const ParcelTypeStep = ({ list, title, onClickParcelSkip, skip }) => {
//   const popularSelect = (obj) => {
//     onClickParcelSkip(Object.keys(obj))(Object.values(obj))();
//     skip(3);
//   };

//   const popular = [
//     { color: "BROWN", type: "BOX", size: "L" },
//     { color: "BROWN", type: "BOX", size: "M" },
//     { color: "BROWN", type: "BOX", size: "S" },
//     { color: "WHITE", type: "BAG", size: "L" },
//     { color: "WHITE", type: "BAG", size: "M" },
//     { color: "WHITE", type: "BAG", size: "S" },
//     { color: "TP", type: "BOX", size: "T" },
//     { color: "TP", type: "BOX", size: "T" },
//     { color: "TP", type: "BOX", size: "T" },
//   ];
//   return (
//     <>
//       <BasicForm title={title}></BasicForm>
//       {list.map((item, i) => {
//         const Image = imgs[item.toLowerCase()];

//         return (
//           <ParcelTypeShortcut item={item}>
//             {["L", "M", "S"].map((size, ii) => (
//               <button
//                 className="btn small"
//                 style={{
//                   background: `black`,
//                 }}
//                 onClick={(e) => [
//                   e.preventDefault(),
//                   onClickParcelSkip(["type", "size"])([item, size])(),
//                   skip(2),
//                 ]}
//               >
//                 <Image size="1em" /> {size}
//               </button>
//             ))}
//           </ParcelTypeShortcut>
//         );
//       })}
//       <br />
//       <ParcelTypeShortcut item={"Popular"}>
//         {popular.map((pop) => (
//           <button className="popular-types">
//             <Parcel
//               {...{
//                 ...pop,
//                 onClick: (e) => [e.preventDefault(), popularSelect(pop)],
//               }}
//             />
//           </button>
//         ))}
//       </ParcelTypeShortcut>
//     </>
//   );
// };

// const ParcelStep = ({ list, title, onClick }) => {
//   const width = 600 / (Math.ceil(list.length / 6) * 6);
//   const height = (list.length < 6 ? 70 : 140) / list.length + "vh";

//   const up = (e) => e.toUpperCase();

//   const style = (item) => ({
//     height,
//     width: width + "%",
//     background: nonColor[up(item)] ? nonColor[up(item)] : item.toLowerCase(),
//   });

//   return (
//     <BasicForm title={title}>
//       {list.map((item, i) => (
//         <Button
//           key={up(item) + i}
//           onClick={onClick(item)}
//           style={style(item)}
//           text={up(item)}
//         />
//       ))}
//     </BasicForm>
//   );
// };

// const Button = ({ onClick, style, text }) => (
//   <button className="btn" style={style} onClick={onClick}>
//     <span>{text}</span>
//   </button>
// );

// const FinalStep = ({ setValue, complete, nextParcel, notes }) => {
//   const onChange = (e) => setValue("notes")(e.target.value);

//   return (
//     <SingleInputForm
//       onSubmit={complete("/deliveries")}
//       title="add notes"
//       input={{ onChange, value: notes, autoFocus: false }}
//     >
//       <Navigation
//         buttons={[
//           {
//             onClick: nextParcel,
//             text: "ADD PARCEL",
//             color: "var(--secondary-color)",
//           },
//           {
//             onClick: complete(0 + ""),
//             text: "NEXT ADDRESS",
//             color: "var(--primary-color)",
//           },
//         ]}
//       />
//       <Navigation
//         buttons={[
//           {
//             onClick: complete("/deliveries"),
//             text: "COMPLETE",
//             color: "var(--ternary-color)",
//           },
//         ]}
//       />
//     </SingleInputForm>
//   );
// };

// const Navigation = ({ buttons }) => (
//   <div className="navigation">
//     {buttons.map((button) => (
//       <Button
//         onClick={button.onClick}
//         text={button.text}
//         style={{ background: button.color }}
//       />
//     ))}
//   </div>
// );

// export const Caption = ({ title }) => {
//   const navigation = useNavigate();
//   const { reset } = useNewParcel();
//   return (
//     <CaptionBasic title={title}>
//       <button type="button" className="back" onClick={(e) => navigation(-1)}>
//         <MdArrowBackIos size={"2rem"} />
//       </button>
//       <button
//         type="button"
//         className="close"
//         onClick={(e) => [navigation("/deliveries"), reset()]}
//       >
//         <MdClose size={"3rem"} />
//       </button>
//     </CaptionBasic>
//   );
// };

// export const CaptionBasic = ({
//   title,
//   children = [null, null],
//   color = "white",
//   background = "var(--ternary-color)",
// }) => {
//   return (
//     <div className="caption" style={{ background }}>
//       {children["0"]}
//       <h2 style={{ color }}>{title.toUpperCase()}</h2>
//       {children["1"]}
//     </div>
//   );
// };

// const BigInput = ({ value, onChange, inputMode = null, autoFocus = true }) => (
//   <input
//     className="big-input"
//     value={value}
//     onChange={onChange}
//     autoFocus={autoFocus}
//     inputMode={inputMode}
//   />
// );

// const SingleInputForm = ({ title, children, onSubmit, input }) => {
//   return (
//     <BasicForm title={title} onSubmit={onSubmit}>
//       <div className="form-content">
//         <BigInput
//           onChange={input.onChange}
//           value={input.value}
//           inputMode={input.inputMode}
//           autoFocus={input.autoFocus}
//         />
//         {children}
//       </div>
//     </BasicForm>
//   );
// };

// const BasicForm = ({ children, title, onSubmit }) => (
//   <form onSubmit={onSubmit}>
//     <Caption title={title} />
//     <div className="form-content">{children}</div>
//   </form>
// );

// const ParcelTypeShortcut = ({ item, children }) => (
//   <div style={{ width: "100%" }}>{children}</div>
// );

// const SuburbCaption = ({ suburb }) => (
//   <span className="suburb-caption">{suburb}</span>
// );

// const NameCaption = ({ name, type }) => (
//   <span className="name-caption">
//     <strong>{name} </strong> {type}
//   </span>
// );

// const NameButton = ({ location, onClick }) => (
//   <button className="location-option" onClick={onClick}>
//     <div>
//       <SuburbCaption suburb={location.suburb} />
//       <NameCaption name={location.name} type={location.type} />
//       <MdOutlineChevronRight />
//     </div>
//   </button>
// );
