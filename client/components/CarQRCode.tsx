import QRCode from "react-qr-code";

const CarQRCode = ({ vin }: { vin: string | string[] | undefined }) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${baseUrl}/cars/${vin}`;

  return (
    <div className=" bg-white rounded-md shadow-sm w-fit my-2">
      <QRCode value={url} size={128} />
    </div>
  );
};

export default CarQRCode;
