// components/ChatThemeWrapper.jsx
import PropTypes from "prop-types";
import { useThemeStore } from "../store/useThemeStore";

const ChatThemeWrapper = ({ children }) => {
    const theme = useThemeStore((state) => state.theme);
    const themeClass = theme === "forest" ? "dark-chat-theme" : "light-chat-theme";

    return <div className={themeClass}>{children}</div>;
};

ChatThemeWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatThemeWrapper;
