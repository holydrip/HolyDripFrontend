export const formatUAPhoneNumber = (value: string): string => {
    let val = value.replace(/\D/g, "");
    if (val.startsWith("38")) val = val.slice(2);
    
    if (val.length === 0) return "";
    
    let formatted = "+38 ";
    if (val.length > 0) formatted += `(${val.substring(0, 3)}`;
    if (val.length >= 4) formatted += `) ${val.substring(3, 6)}`;
    if (val.length >= 7) formatted += `-${val.substring(6, 8)}`;
    if (val.length >= 9) formatted += `-${val.substring(8, 10)}`;
    
    return formatted;
};