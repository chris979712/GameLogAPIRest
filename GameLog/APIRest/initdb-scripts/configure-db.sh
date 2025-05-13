#!/bin/bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i sqlinit.sql -C
