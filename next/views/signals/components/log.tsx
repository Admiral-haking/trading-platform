import { Box, Divider, Stack, Typography } from "@mui/material";
import { getTime } from "../utils/time";
import { useMemo } from "react";

export default function Log({ message, timestamp }: { timestamp: number, message: string }) {
    const { color, icon } = useMemo(() => {
        const foundedReg = Object.entries(regexes).find(x => x[1].test(message));
        if (!foundedReg) return {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M11.718 7.215a.75.75 0 0 0-1.436-.43l-.74 2.465H7a.75.75 0 0 0 0 1.5h2.092l-.75 2.5H6a.75.75 0 1 0 0 1.5h1.892l-.61 2.034a.75.75 0 0 0 1.436.431l.74-2.465h3.434l-.61 2.034a.75.75 0 0 0 1.436.431l.74-2.465H17a.75.75 0 0 0 0-1.5h-2.092l.75-2.5H18a.75.75 0 0 0 0-1.5h-1.892l.61-2.035a.75.75 0 0 0-1.436-.43l-.74 2.465h-3.434zm2.374 3.535l-.75 2.5H9.908l.75-2.5z" clipRule="evenodd"></path></svg>,
            color: 'text.secondary'
        }
        const [name] = foundedReg;

        return {
            icon: (icons as any)[name],
            color: (colors as any)[name]
        }
    }, [message])
    return <Stack direction="row" gap={1} alignItems="center" sx={{ width: '100%' }}>
        <Typography component="span" color={color}>
            {icon}
        </Typography>
        <Box sx={{ flex: '1 1 auto' }}>
            <Stack direction="row" gap={1} alignItems="center" sx={{ width: '100%' }}>
                <Typography sx={{ fontSize: 9 }} color="text.secondary">
                    {getTime(timestamp)}
                </Typography>
                <Box sx={{ flex: '1 1 auto' }}>
                    <Divider />
                </Box>
                <Typography component="span" sx={{ fontSize: 9 }}>
                    {new Date(timestamp).toLocaleString()}
                </Typography>
            </Stack>

            <Typography sx={{ fontSize: 11 }} color={color}>
                {message}
            </Typography>
        </Box>
    </Stack>
}



const regexes = {
    closedByUser: /Closed By User/,
    deleteSig: /deleting signal due to income delete signal/,
    exitSig: /exiting from position due to the income exit signal/,
    stMoving: /moving stop loss to last check point/,
    stMoved: /stop loss was moved from/,
    initOrder: /Initiating Place Order/,
    orderConf: /Order is Conflicting with an other Order/,
    insf: /we don't have enough USDT/,
    orderSkip: /Place Order is Skipped/,
    warn: /Warning/,
    placing: /Placing Order/,
    orderSuccess: /Order Placed Successfully/,
    changeToFill: /Position Founded/,
    cancelOrder: /Cancelling Order/,
    orderFucked: /Order cannot be cancel due to finished or filled state/,
    orderCancelled: /Order has been cancelled successfully/,
    adjustLev: /adjusting position leverage/,
    levAdjusted: /leverage has been /,
    closingPs: /closing position/,
    closed: /position closed successfully/,
    error: /failed|error/,
    st_tp: /setting SL/
}


const colors = {
    closedByUser: "error.main",
    deleteSig: "error.main",
    exitSig: "warning.main",
    stMoving: "info.main",
    stMoved: "success.main",
    initOrder: "info.main",
    orderConf: "warning.main",
    insf: "error.main",
    orderSkip: "warning.main",
    warn: "warning.main",
    placing: "info.main",
    orderSuccess: "success.main",
    changeToFill: "primary.main",
    cancelOrder: "secondary.main",
    orderFucked: "secondary.main",
    orderCancelled: "warning.main",
    adjustLev: "info.main",
    levAdjusted: "success.main",
    closingPs: "info.main",
    closed: "success.main",
    error: "error.main",
    st_tp: "primary.main"
}

const icons = {
    closedByUser: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M9.345 8.23A.788.788 0 1 0 8.23 9.346A.788.788 0 0 0 9.345 8.23m2.784.929a.787.787 0 1 0-1.114 1.114a.787.787 0 0 0 1.114-1.114m3.712 3.712a.788.788 0 1 1-1.114 1.114a.788.788 0 0 1 1.114-1.114m.929 3.899a.787.787 0 1 0-1.114-1.114a.787.787 0 0 0 1.114 1.114m-3.713-3.713a.787.787 0 1 0-1.113-1.114a.787.787 0 0 0 1.113 1.114m.928 1.671a.788.788 0 1 1-1.114 1.113a.788.788 0 0 1 1.114-1.113m-4.826-3.713a.787.787 0 1 1 1.114 1.114a.787.787 0 0 1-1.114-1.114"></path><path fill="currentColor" fillRule="evenodd" d="M14.399 2.683A4.892 4.892 0 1 1 21.317 9.6L18.92 12l2.398 2.399a4.892 4.892 0 1 1-6.918 6.918L12 18.92l-2.399 2.398A4.892 4.892 0 0 1 2.683 14.4L5.08 12L2.683 9.601A4.892 4.892 0 0 1 9.6 2.683L12 5.08zm5.858 12.776a3.392 3.392 0 0 1-4.798 4.797L3.744 8.542A3.392 3.392 0 0 1 8.54 3.744zm0-6.918l-2.4 2.398l-4.796-4.797l2.398-2.398a3.392 3.392 0 1 1 4.797 4.797M3.743 15.459l2.398-2.398l4.797 4.797l-2.398 2.398a3.392 3.392 0 0 1-4.797-4.797" clipRule="evenodd"></path></svg>,
    deleteSig: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M22 18a4 4 0 1 1-8 0a4 4 0 0 1 8 0" opacity={0.5}></path><path fill="currentColor" d="M16.47 16.47a.75.75 0 0 1 1.06 0l.47.47l.47-.47a.75.75 0 0 1 1.06 1.06l-.47.47l.47.47a.75.75 0 0 1-1.06 1.06l-.47-.47l-.47.47a.75.75 0 0 1-1.06-1.06l.47-.47l-.47-.47a.75.75 0 0 1 0-1.06"></path><path fill="currentColor" fillRule="evenodd" d="M22 7.3V5.188c0-.175 0-.262-.004-.335c-.08-1.541-1.385-2.774-3.017-2.85C18.901 2 18.81 2 18.625 2c-.307 0-.46 0-.59.006c-2.72.126-4.895 2.18-5.029 4.749c-.006.122-.006.267-.006.558v8.393a5.5 5.5 0 0 1 4.765-3.201V11.3c0-.552.474-1 1.058-1c1.755 0 3.177-1.343 3.177-3M20.25 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z" clipRule="evenodd"></path><path fill="currentColor" d="M2 9.3V7.187c0-.174 0-.26.004-.334c.08-1.541 1.385-2.774 3.017-2.85C5.098 4 5.19 4 5.375 4c.307 0 .46 0 .59.006c2.72.126 4.895 2.18 5.029 4.749c.006.122.006.267.006.557V19.75C11 20.993 9.933 22 8.618 22s-2.383-1.007-2.383-2.25V13.3c0-.552-.474-1-1.059-1C3.422 12.3 2 10.957 2 9.3" opacity={0.5}></path><path fill="currentColor" d="M11 18.25H6.235v1.5H11zm-6.5-12a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0V7a.75.75 0 0 0-.75-.75"></path></svg>,
    exitSig: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a9 9 0 1 0 0-18a9 9 0 0 0 0 18" opacity={0.5}></path><path fill="currentColor" d="M14.652 10.349a.75.75 0 0 1 0 1.06L13.06 13l1.59 1.591a.75.75 0 0 1-1.06 1.06L12 14.061l-1.592 1.59a.75.75 0 0 1-1.06-1.06l1.59-1.59l-1.59-1.592a.75.75 0 0 1 1.06-1.06L12 11.939l1.591-1.59a.75.75 0 0 1 1.06 0"></path><path fill="currentColor" fillRule="evenodd" d="M8.24 2.34a.72.72 0 0 1-.232.996l-3.891 2.41a.734.734 0 0 1-1.006-.23a.72.72 0 0 1 .232-.996l3.892-2.41a.734.734 0 0 1 1.006.23m7.519 0a.734.734 0 0 1 1.005-.23l3.892 2.41a.72.72 0 0 1 .232.996a.734.734 0 0 1-1.006.23l-3.891-2.41a.72.72 0 0 1-.233-.996" clipRule="evenodd"></path></svg>,
    stMoving: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M13.926 9.705c-.379-.371-.379-.963-.379-2.148v-.31c0-3.285 0-4.927-.923-5.21s-1.913 1.056-3.892 3.734L5.67 9.914c-1.285 1.739-1.928 2.608-1.574 3.291l.018.034c.375.673 1.485.673 3.704.673c1.233 0 1.85 0 2.236.363"></path><path d="m13.926 9.706l.02.019c.387.364 1.003.364 2.236.364c2.22 0 3.329 0 3.703.672l.019.034c.354.684-.289 1.553-1.574 3.29l-3.062 4.144c-1.98 2.678-2.969 4.017-3.892 3.734c-.924-.283-.924-1.925-.923-5.21v-.31c0-1.184 0-1.777-.379-2.148l-.02-.02" opacity={0.5}></path></g></svg>,
    stMoved: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 22a7.5 7.5 0 1 0 0-15a7.5 7.5 0 0 0 0 15" opacity={0.5}></path><path fill="currentColor" d="M17.981 2.353a.558.558 0 0 1 1.038 0l.654 1.66c.057.143.17.257.315.314l1.659.654c.47.186.47.852 0 1.038l-1.66.654a.56.56 0 0 0-.314.315l-.654 1.659a.558.558 0 0 1-1.038 0l-.654-1.66a.56.56 0 0 0-.315-.314l-1.659-.654a.558.558 0 0 1 0-1.038l1.66-.654a.56.56 0 0 0 .314-.315z"></path><path fill="currentColor" d="m16.477 6.462l-2.23 2.231a7.6 7.6 0 0 1 1.06 1.06l2.23-2.23l-.21-.535a.56.56 0 0 0-.315-.315z" opacity={0.7}></path><path fill="currentColor" d="M12 16.75a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5zm2-4.25c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5M9 14c.552 0 1-.672 1-1.5S9.552 11 9 11s-1 .672-1 1.5s.448 1.5 1 1.5"></path></svg>,
    initOrder: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity={0.5}></path><path fill="currentColor" d="M12 10.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M8 8a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m4-2.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"></path></svg>,
    orderConf: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M3.464 3.464C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536" opacity={0.5}></path><path fill="currentColor" d="M12.75 17.5a.75.75 0 0 1-1.5 0v-6A3.25 3.25 0 0 0 8 8.25h-.19l.22.22a.75.75 0 0 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 0 1 1.06 1.06l-.22.22H8c1.68 0 3.155.872 4 2.187a4.75 4.75 0 0 1 4-2.187h.19l-.22-.22a.75.75 0 0 1 1.06-1.06l1.5 1.5a.75.75 0 0 1 0 1.06l-1.5 1.5a.75.75 0 1 1-1.06-1.06l.22-.22H16a3.25 3.25 0 0 0-3.25 3.25z"></path></svg>,
    insf: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17.414 10.414C18 9.828 18 8.886 18 7s0-2.828-.586-3.414m0 6.828C16.828 11 15.886 11 14 11h-4c-1.886 0-2.828 0-3.414-.586m10.828 0Zm0-6.828C16.828 3 15.886 3 14 3h-4c-1.886 0-2.828 0-3.414.586m10.828 0Zm-10.828 0C6 4.172 6 5.114 6 7s0 2.828.586 3.414m0-6.828Zm0 6.828Z"></path><path d="M13 7a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z" opacity={0.5}></path><path strokeLinecap="round" d="M18 6a3 3 0 0 1-3-3m3 5a3 3 0 0 0-3 3M6 6a3 3 0 0 0 3-3M6 8a3 3 0 0 1 3 3M4 21.388h2.26c1.01 0 2.033.106 3.016.308a14.9 14.9 0 0 0 5.33.118c.868-.14 1.72-.355 2.492-.727c.696-.337 1.549-.81 2.122-1.341c.572-.53 1.168-1.397 1.59-2.075c.364-.582.188-1.295-.386-1.728a1.89 1.89 0 0 0-2.22 0l-1.807 1.365c-.7.53-1.465 1.017-2.376 1.162q-.165.026-.345.047m0 0l-.11.012m.11-.012a1 1 0 0 0 .427-.24a1.49 1.49 0 0 0 .126-2.134a1.9 1.9 0 0 0-.45-.367c-2.797-1.669-7.15-.398-9.779 1.467m9.676 1.274a.5.5 0 0 1-.11.012m0 0a9.3 9.3 0 0 1-1.814.004" opacity={0.5}></path></g></svg>,
    orderSkip: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M22.75 5a.75.75 0 0 0-1.5 0v14a.75.75 0 0 0 1.5 0z" opacity={0.5}></path><path fill="currentColor" d="M16.66 14.647c1.787-1.154 1.787-4.14 0-5.294L5.87 2.385C4.135 1.264 2 2.724 2 5.033v13.934c0 2.31 2.134 3.769 3.87 2.648z"></path></svg>,
    warn: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-2.31 0-3.77 2.587-6.688 7.762l-.364.644c-2.425 4.3-3.638 6.45-2.542 8.022S6.214 21 11.636 21h.728c5.422 0 8.134 0 9.23-1.572s-.117-3.722-2.542-8.022l-.364-.645C15.77 5.587 14.311 3 12 3" opacity={0.5}></path><path fill="currentColor" d="M12 7.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2"></path></svg>,
    placing: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M2.277 5.247a.75.75 0 0 1 .924-.522l1.703.472A2.71 2.71 0 0 1 6.8 7.075l2.151 7.786l.158.547a2.96 2.96 0 0 1 1.522 1.267l.31-.096l8.87-2.305a.75.75 0 1 1 .378 1.452l-8.837 2.296l-.33.102c-.006 1.27-.883 2.432-2.21 2.776c-1.59.414-3.225-.502-3.651-2.044s.518-3.129 2.108-3.542q.119-.03.237-.052L5.354 7.474a1.21 1.21 0 0 0-.85-.831L2.8 6.17a.75.75 0 0 1-.523-.923"></path><path fill="currentColor" d="m9.564 8.73l.515 1.863c.485 1.755.727 2.633 1.44 3.032c.713.4 1.618.164 3.428-.306l1.92-.5c1.81-.47 2.715-.705 3.127-1.396c.412-.692.17-1.57-.316-3.325l-.514-1.862c-.485-1.756-.728-2.634-1.44-3.033c-.714-.4-1.619-.164-3.429.307l-1.92.498c-1.81.47-2.715.706-3.126 1.398c-.412.691-.17 1.569.315 3.324" opacity={0.5}></path></svg>,
    orderSuccess: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6.25 19a.75.75 0 0 0 1.32.488l6-7a.75.75 0 0 0 0-.976l-6-7A.75.75 0 0 0 6.25 5z" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M10.512 19.57a.75.75 0 0 1-.081-1.058L16.012 12l-5.581-6.512a.75.75 0 1 1 1.139-.976l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.058.082" clipRule="evenodd"></path></svg>,
    changeToFill: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M9 19v-1.343c0-.818 0-1.226-.152-1.594L8.82 16h6.36q-.015.03-.027.063C15 16.431 15 16.84 15 17.657V20c0 .943 0 1.414-.293 1.707C14.416 22 13.944 22 13 22h-2c-.942 0-1.414 0-1.707-.293S9 20.943 9 20z" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M12 18.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75" clipRule="evenodd"></path><path fill="currentColor" d="M20 10.172V10c0-.943 0-1.414-.293-1.707S18.943 8 18 8H6c-.943 0-1.414 0-1.707.293S4 9.057 4 10v.172c0 .408 0 .613.076.797L4.09 11h15.82l.014-.031c.076-.184.076-.389.076-.797" opacity={0.5}></path><path fill="currentColor" d="m16.171 14.828l3.243-3.242c.272-.273.416-.417.496-.586H4.09c.08.17.223.313.496.586l3.242 3.242c.545.545.833.833.992 1.172h6.36c.159-.339.447-.627.991-1.172M12.75 2a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0zm-6.22.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06-1.06zm12 0a.75.75 0 0 0-1.06 0l-2 2a.75.75 0 0 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06"></path></svg>,
    cancelOrder: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M22 14v-2.202c0-2.632 0-3.949-.77-4.804a3 3 0 0 0-.224-.225C20.151 6 18.834 6 16.202 6h-.374c-1.153 0-1.73 0-2.268-.153a4 4 0 0 1-.848-.352C12.224 5.224 11.816 4.815 11 4l-.55-.55c-.274-.274-.41-.41-.554-.53a4 4 0 0 0-2.18-.903C7.53 2 7.336 2 6.95 2c-.883 0-1.324 0-1.692.07A4 4 0 0 0 2.07 5.257C2 5.626 2 6.068 2 6.95V14c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14" opacity={0.5}></path><path fill="currentColor" d="M9.97 11.47a.75.75 0 0 1 1.06 0l.97.97l.97-.97a.75.75 0 1 1 1.06 1.06l-.97.97l.97.97a.75.75 0 1 1-1.06 1.06l-.97-.97l-.97.97a.75.75 0 1 1-1.06-1.06l.97-.97l-.97-.97a.75.75 0 0 1 0-1.06"></path></svg>,
    orderFucked: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 21c4.418 0 8-3.356 8-7.496c0-3.741-2.035-6.666-3.438-8.06c-.26-.258-.694-.144-.84.189c-.748 1.69-2.304 4.123-4.293 4.123c-1.232.165-3.112-.888-1.594-6.107c.137-.47-.365-.848-.749-.534C6.905 4.905 4 8.511 4 13.504C4 17.644 7.582 21 12 21" opacity={0.5}></path><path fill="currentColor" d="M4.477 16.059A8.99 8.99 0 0 1 12 12a8.99 8.99 0 0 1 7.523 4.059A7.1 7.1 0 0 0 20 13.504c0-3.741-2.035-6.666-3.438-8.06c-.26-.258-.694-.144-.84.189c-.748 1.69-2.304 4.123-4.293 4.123c-1.232.165-3.112-.888-1.594-6.107c.137-.47-.365-.848-.749-.534C6.905 4.905 4 8.511 4 13.504c0 .897.168 1.757.477 2.555"></path></svg>,
    orderCancelled: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M9 16h6"></path><ellipse cx={15} cy={10.5} fill="currentColor" rx={1} ry={1.5}></ellipse><ellipse cx={9} cy={10.5} fill="currentColor" rx={1} ry={1.5}></ellipse><path stroke="currentColor" strokeWidth={1.5} d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" opacity={0.5}></path></g></svg>,
    adjustLev: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M22 10.5V12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2h1.5" opacity={0.5}></path><circle cx={19} cy={5} r={3}></circle><path strokeLinecap="round" strokeLinejoin="round" d="m7 14l2.293-2.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0L17 10m0 0v2.5m0-2.5h-2.5"></path></g></svg>,
    levAdjusted: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M11.663 11.25a3.251 3.251 0 1 0 0 1.5h3.087v.75a.75.75 0 0 0 1.5 0v-.75H17a.25.25 0 0 1 .25.25v1a.75.75 0 0 0 1.5 0v-1A1.75 1.75 0 0 0 17 11.25zm-3.163-1a1.75 1.75 0 1 0 0 3.5a1.75 1.75 0 0 0 0-3.5" clipRule="evenodd"></path></svg>,
    closingPs: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2" opacity={0.6}></path><path fill="currentColor" d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z" opacity={0.4}></path><path fill="currentColor" fillRule="evenodd" d="M14.53 11.47a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72H5a.75.75 0 0 1 0-1.5h7.19l-.72-.72a.75.75 0 1 1 1.06-1.06z" clipRule="evenodd"></path></svg>,
    closed: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M21 6.43v5.47c0 5.69-4.239 8.45-6.899 9.622C13.38 21.841 13.02 22 12 22s-1.38-.159-2.101-.477C7.239 20.351 3 17.59 3 11.901V6.43c0-2.269 0-3.404.707-4.024c.708-.621 1.789-.434 3.95-.061l1.055.182c1.64.283 2.46.425 3.288.425s1.648-.142 3.288-.425l1.054-.182c2.163-.373 3.244-.56 3.95.06C21 3.026 21 4.16 21 6.43" opacity={0.5}></path><path fill="currentColor" d="M7.171 9.14c.124-.256.586-.606 1.33-.606c.742 0 1.205.35 1.328.606a.74.74 0 0 0 1.006.348a.79.79 0 0 0 .336-1.043c-.459-.95-1.567-1.466-2.67-1.466c-1.104 0-2.213.515-2.672 1.466a.79.79 0 0 0 .336 1.043a.74.74 0 0 0 1.006-.348m8.329-.606c-.743 0-1.206.35-1.329.606a.74.74 0 0 1-1.006.348a.79.79 0 0 1-.336-1.043c.459-.95 1.568-1.466 2.671-1.466c1.104 0 2.212.515 2.671 1.466a.79.79 0 0 1-.336 1.043a.74.74 0 0 1-1.006-.348c-.123-.256-.586-.606-1.329-.606m-7.511 6.008a.804.804 0 0 1-.032-1.104a.75.75 0 0 1 1.067-.022c.02.016.067.053.103.079c.1.071.267.177.506.285c.475.217 1.248.453 2.367.453c1.12 0 1.892-.236 2.367-.453c.239-.108.406-.214.507-.285q.075-.055.102-.079l.014-.012l.001-.001a.73.73 0 0 1 1.052.035a.797.797 0 0 1-.026 1.098v.002h-.002l-.003.004l-.008.007l-.02.019l-.06.052a3 3 0 0 1-.202.156a4.6 4.6 0 0 1-.751.427c-.663.302-1.64.584-2.97.584s-2.309-.282-2.971-.584a4.6 4.6 0 0 1-.752-.427a3 3 0 0 1-.288-.232z"></path></svg>,
    error: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M11.157 20.313a9.157 9.157 0 1 0 0-18.313a9.157 9.157 0 0 0 0 18.313" opacity={0.5}></path><path fill="currentColor" d="M17.1 18.122a9 9 0 0 0 1.022-1.022l3.666 3.666a.723.723 0 0 1-1.022 1.022z"></path><path fill="currentColor" fillRule="evenodd" d="M8.023 11.157c0-.4.324-.723.723-.723h4.82a.723.723 0 1 1 0 1.445h-4.82a.723.723 0 0 1-.723-.723" clipRule="evenodd"></path></svg>,
    st_tp: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M2.75 12a4.25 4.25 0 0 1 6.8-3.4a.75.75 0 1 0 .901-1.2A5.75 5.75 0 1 0 7 17.75c.784 0 1.464-.143 2.064-.435s1.079-.714 1.489-1.215c.66-.804 1.196-1.894 1.776-3.074l.339-.689a.755.755 0 0 0-.339-1.008a.745.745 0 0 0-1.003.337l-.366.743c-.584 1.183-1.027 2.082-1.567 2.74c-.307.375-.624.64-.986.817s-.81.284-1.407.284A4.25 4.25 0 0 1 2.75 12" clipRule="evenodd"></path><path fill="currentColor" d="M12.67 12.335a.755.755 0 0 0-.34-1.006a.746.746 0 0 0-.975.284q.162-.323.316-.639c.58-1.18 1.117-2.27 1.776-3.074c.41-.501.89-.923 1.49-1.215S16.217 6.25 17 6.25a5.75 5.75 0 1 1-3.45 10.35a.75.75 0 0 1 .9-1.2A4.25 4.25 0 1 0 17 7.75c-.596 0-1.045.107-1.406.284c-.363.176-.68.442-.987.816c-.54.66-.983 1.558-1.567 2.741q-.174.355-.369.744z" opacity={0.5}></path></svg>
}