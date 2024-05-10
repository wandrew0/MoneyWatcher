import datetime
import json
import random
import sys
from typing import List, Dict

merchants = [
    "24 hour fitness", "Arby's", "Hilton", "Amazon", "United", "Wal-Mart",
    "Safeway", "GameStop", "Macy's", "Wall Street Journal", "Starbucks", "Pizza My Heart",
    "Happy Cafe", "TOGO's", "KFC", "Expensive Shoe Store", "Coach", "Oil Changer",
    "AAA Travel", "Hobby Store", "Financial Times", "Uber", "WEE INC", "BENTO EXPRESS",
    "Kate's Nail Salon", "Happy Spa", "Discord", "SteamGames", "Blizzard", "Spotify",
    "THE SMOKE DEN", "BAR BLISS", "Disney", "GameHive.com", "PlaySphere",
    "Happy House Keepers", "A+ Plumbing Experts", "GoldenHarbor Traders", "Den's Diver",
    "Whole Foods", "Lush Marketplace"]
config = {}


def generate_transaction_list(date: datetime.date,
                              count: int) -> List[Dict[str, any]]:
    ret = []
    for _ in range(count):
        transaction = {"date_transacted": date.strftime("%Y-%m-%d"),
                       "date_posted": date.strftime("%Y-%m-%d"),
                       "description": random.choice(merchants),
                       "amount": random.randint(1, 1000),
                       "currency": "USD"}
        ret.append(transaction)
    return ret


def generate_transactions() -> List[Dict[str, any]]:
    total_days = config.get('days')
    start_day = config.get('start_day')
    count = config.get('transaction_count')
    total = []
    current_day = datetime.datetime.strptime(start_day, '%Y-%m-%d')

    for _ in range(total_days):
        transaction_list = generate_transaction_list(current_day, count)
        total.extend(transaction_list)
        current_day += datetime.timedelta(days=1)
    return total


def create_plaid_config_for_credit() -> Dict[str, any]:
    ret = {"type": "credit", "subtype": "credit card"}
    names = [config.get("name")]
    namesO = {"names": names}
    ret["identity"] = namesO
    ret["transactions"] = generate_transactions()
    return ret


def main():
    file_path = 'config.json'
    global config
    config = json.load(open(file_path))
    credit_account = create_plaid_config_for_credit()
    out = {"override_accounts": [credit_account]}
    with open(config.get('out'), 'w') as outfile:
        json.dump(out, outfile, indent=4)
    sys.exit()


if __name__ == '__main__':
    main()
