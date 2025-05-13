#!/bin/bash

/opt/mssql/bin/sqlservr &

SQL_PID=$!

echo "Esperando a que SQL Server esté listo..."
for i in {1..60}; do
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "SQL Server está listo."
        break
    fi
    echo "Esperando..."
    sleep 1
done

/usr/config/configure-db.sh

wait $SQL_PID
