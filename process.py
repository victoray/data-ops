import pandas as pd


def process(output_file, period="d"):
    df = pd.read_excel(
        f"https://www.eia.gov/dnav/ng/hist_xls/RNGWHHD{period}.xls",
        sheet_name="Data 1",
        header=None,
        names=["Date", "Price"],
    )

    # remove description rows
    df = df[3:]
    df["Date"] = df["Date"].map(lambda x: pd.to_datetime(x))
    df.to_csv(output_file, index=None)
    # create json output for client
    df.to_json(f"client/src/data/{output_file[:-4]}.json", orient="records")


if __name__ == "__main__":
    process("daily_prices.csv")
    process("monthly_prices.csv", period="m")
    process("annual_prices.csv", period="a")
    process("weekly_prices.csv", period="w")
