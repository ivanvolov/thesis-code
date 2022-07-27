library(igraph)

# Распределение транзакций
df <- read.csv(file = "meta/tx_dist_MB_NFT_v2.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]

plot(df$timestamp, df$value, xaxt="n", type="l", xlab = "", ylab = "")
axis.Date(1, at=df$timestamp, labels=format(df$timestamp,"%b-%d"), las=2)

# Распределение транзакций в которых цена идет на увеличение
df <- read.csv(file = "meta/max_tx_dist_MB_NFT_v2.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]
lines(df$timestamp, df$value, col="green")

# Распределение гапа между всеми транзакциями и max_tx_dist_MB_NFT_v2
df <- read.csv(file = "meta/diff_tx_dist_MB_NFT_v2.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]
lines(df$timestamp, df$value, col="red")

# Распределение максимальной цены по каждой NFT
df <- read.csv(file = "meta/max_point_tx_dist_MB_NFT_v2.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]
lines(df$timestamp, df$value, col="pink")

# Распределение максимальной цены по каждой NFT 2 способ
df <- read.csv(file = "meta/tx_dist_MB_NFT_v3.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]
lines(df$timestamp, df$value, col="green")

# Распределение максимальной цены по каждой NFT которая не цена первой продажи
df <- read.csv(file = "meta/tx_dist_MB_NFT_v4.csv")
df$timestamp = as.Date(strptime(df$key, "%d-%m-%Y"))
df = df[order(as.Date(df$key, format="%d-%m-%Y")),]
lines(df$timestamp, df$value, col="orange")
