import { toast } from "react-toastify";

export interface NotificationProps {
  type?: string;
  title: string;
  message: string;
  link?: string;
}

// notification component
const Notification = ({ type, title, message, link }: NotificationProps) => {
  const messageWithOrWithoutLink = link ? (
    // with link
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: "12px", color: "black" }}
    >
      <span>
        {message}
        <b style={{ marginLeft: "8px" }}>Show transaction</b>
      </span>
    </a>
  ) : (
    // without link
    <div style={{ fontSize: "12px", color: "black" }}>{message}</div>
  );

  const container = (
    <div style={{ paddingLeft: "8px", paddingRight: "8px", color: "black" }}>
      <div style={{ fontSize: "18px", marginRight: "4px" }}>{title}</div>
      <div style={{ fontSize: "16px" }}>{messageWithOrWithoutLink}</div>
    </div>
  );

  switch (type) {
    case "success":
      return toast.success(container);
    case "warn":
      return toast.warn(container);
    case "error":
      return toast.error(container);
    default:
      return toast(container);
  }
};

export default Notification;
