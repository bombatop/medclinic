package courseproject.springbootbackend.controller;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import courseproject.springbootbackend.model.Treatment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestDTO_AddPriceForJournal {
    Treatment treatment;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    Date date;
}