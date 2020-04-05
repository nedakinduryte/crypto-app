import React from "react";
import { currencySymbols } from "../../constants";
import { CoinPicker } from "../CoinPicker/CoinPicker.view";
import { CurrencyPicker } from "../CurrencyPicker/CurrencyPicker.view";
import { DateTime } from "../DateTime/DateTime.view";
import { CurrentPrice } from "../CurrentPrice/CurrentPrice.view";
import { HighPrice } from "../HighPrice/HighPrice.view";
import { LowPrice } from "../LowPrice/LowPrice.view";
import {
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
} from "recharts";

import { Wrapper, Container } from "./Chart.styles";

const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

export const Chart: React.FC = () => {
    const [coin, setCoin] = React.useState("BTC" as string);
    const [currency, setCurrency] = React.useState("USD" as string);
    const [data, setData] = React.useState(
        [] as {
            time: Date;
            price: string;
            highPrice: string;
            lowPrice: string;
        }[]
    );

    /** Saves the previous data from the state on state update */
    const dataRef = React.useRef(data);
    dataRef.current = data;

    /** Creates subscibe message */
    const subscribeMessage = (coinName: string, currencyName: string) => {
        return {
            type: "subscribe",
            channels: [
                {
                    name: "ticker",
                    product_ids: [`${coinName}-${currencyName}`],
                },
            ],
        };
    };

    /** Creates unsubscibe message */
    const unsubscribeMessage = (coinName: string, currencyName: string) => {
        return {
            type: "unsubscribe",
            product_ids: [`${coinName}-${currencyName}`],
            channels: ["ticker"],
        };
    };

    /** Parses the response and sets it to state */
    const parseResponse = (response: { data: string }) => {
        const parsedResponse = JSON.parse(response.data);

        parsedResponse.price &&
            setData([
                ...dataRef.current,
                {
                    time: new Date(parsedResponse.time),
                    price: parsedResponse.price,
                    highPrice: parsedResponse.high_24h,
                    lowPrice: parsedResponse.low_24h,
                },
            ]);
    };

    React.useEffect(() => {
        ws.onopen = () => {
            ws.send(JSON.stringify(subscribeMessage(coin, currency)));
        };

        ws.onmessage = (response) => {
            parseResponse(response);
        };
    }, []);

    /** Updates the currency that is displayed */
    const updateCurrency = (newCurrency: string) => {
        setData([]);

        ws.send(JSON.stringify(unsubscribeMessage(coin, currency)));

        ws.send(JSON.stringify(subscribeMessage(coin, newCurrency)));

        setCurrency(newCurrency);
    };

    /** Updates the cryptocurrency that is displayed */
    const updateCoin = (newCoin: string) => {
        setData([]);

        ws.send(JSON.stringify(unsubscribeMessage(coin, currency)));

        ws.send(JSON.stringify(subscribeMessage(newCoin, currency)));

        setCoin(newCoin);
    };

    return (
        <Wrapper>
            <CoinPicker updateCoin={updateCoin} />
            <Container>
                <CurrencyPicker updateCurrency={updateCurrency} />
                <DateTime />
            </Container>
            <CurrentPrice
                price={data.length > 0 ? data[data.length - 1].price : "0"}
                currency={currency}
                coin={coin}
                symbol={currencySymbols[currency]}
            />
            <HighPrice
                symbol={currencySymbols[currency]}
                highPrice={
                    data.length > 0 ? data[data.length - 1].highPrice : "0"
                }
            />
            <LowPrice
                symbol={currencySymbols[currency]}
                lowPrice={
                    data.length > 0 ? data[data.length - 1].lowPrice : "0"
                }
            />
            <AreaChart
                width={730}
                height={250}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis
                    type="number"
                    domain={["dataMin - 3", "dataMax + 3"]}
                    allowDecimals={false}
                    unit={currency === "USD" ? "$" : "€"}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                    isAnimationActive={false}
                />
            </AreaChart>
            <button onClick={() => ws.close()}>STOP</button>
        </Wrapper>
    );
};
